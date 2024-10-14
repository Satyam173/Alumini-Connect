import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

// Helper function for sending error responses
const handleError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: 'Something went wrong', success: false });
};

// Add New Post
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: 'Image Required' });

    // Image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: 'author', select: '-password' });

    return res.status(201).json({
      message: 'New post added',
      post,
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get All Posts
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'profilePicture username' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get User's Posts
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Like or Dislike Post (Refactored)
const likeOrDislikePost = async (req, res, action) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    // Like or Dislike Logic
    const updateQuery = action === 'like' ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };
    await post.updateOne(updateQuery);
    await post.save();

    // Implement socket.io notification
    const user = await User.findById(userId).select('username profilePicture');
    const postOwnerId = post.author.toString();

    if (postOwnerId !== userId) {
      const notification = {
        type: action,
        userId,
        userDetails: user,
        postId,
        message: `Your post was ${action}d`,
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({
      message: `Post ${action}d`,
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Like Post
export const likePost = (req, res) => likeOrDislikePost(req, res, 'like');

// Dislike Post
export const dislikePost = (req, res) => likeOrDislikePost(req, res, 'dislike');

// Add Comment
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const {text}  = req.body;

    if (!text) return res.status(400).json({ message: 'Text is required', success: false });

    const comment = await Comment.create({
      text:text,
      author: userId,
      post: postId,
    });

    await comment.populate({ path: 'author', select: 'username profilePicture' });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: 'Comment added',
      comment,
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Comments of a Post
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: 'author',
      select: 'username profilePicture',
    });

    if (!comments) return res.status(404).json({ message: 'No comments found', success: false });

    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized', success: false });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: 'Post deleted',
      success: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Bookmark Post
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(postId)) {
      await user.updateOne({ $pull: { bookmarks: postId } });
      return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmarks', success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: postId } });
      return res.status(200).json({ type: 'saved', message: 'Post saved to bookmarks', success: true });
    }
  } catch (error) {
    return handleError(res, error);
  }
};
