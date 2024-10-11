import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js'
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Comment } from '../models/comment.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';

export const addNewPost = async(req,res)=>{
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) return res.status(400).json({message:"Image Required"})
        
            // image upload
            const optimisedImageBuffer = await sharp(image.buffer)
            .resize({width:800,height:800,fit:'inside'})
            .toFormat('jpeg',{quality:80})
            .toBuffer();

            const fileUri = `data:image/jpeg;base64,${optimisedImageBuffer.toString('base64')}`;
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            const post = await Post.create({
                caption,
                image:cloudResponse.secure_url,
                author:authorId
            });
            const user = await User.findById(authorId);
            if(user)
            {
                user.posts.push(post._id);
                await user.save();
            }

            await post.populate({path:'author',select:'-password'});

            return res.status(201).json({
                message:'New post added',
                post,
                success:true
            })
        
    } catch (error) {
        console.log(error);
        
    }
}

export const getAllPost = async(req,res)=> {
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author',select:'profilePicture,username'})
        .populate({path:'comments',sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getUserPost = async (req,res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1})
        .populate({path:'author',select:'username,profilePicture'
        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
            
        });
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);       
    }
}
export const likePost = async(req,res)=>{
    try {
        const likeKarnewalaUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found',success:false});

        // like logic started
        await post.updateOne({$addToSet:{likes:likeKarnewalaUserkiId}});
        await post.save();

        //implement socket.io
        const user = await User.findById(likeKarnewalaUserkiId).select("username profilePicture");
        const postOwnerId = post.author.toString();

        if(postOwnerId!=likeKarnewalaUserkiId){
            // emit a notification event
            const notification = {
                type:'like',
                userId:likeKarnewalaUserkiId,
                userDetails:user,
                postId,
                message:"Your post was liked"
            }
            const postOwnerScoketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerScoketId).emit('notification',notification);
        }


        return res.status(200).json({
            message:"Post liked",
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const dislikePost = async(req,res)=>{
    try {
        const likeKarnewalaUserkiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found',success:false});

        // like logic started
        await post.updateOne({$pull:{likes:likeKarnewalaUserkiId}});
        await post.save();

        //implement socket.io
        const user = await User.findById(likeKarnewalaUserkiId).select("username profilePicture");
        const postOwnerId = post.author.toString();

        if(postOwnerId!=likeKarnewalaUserkiId){
            // emit a notification event
            const notification = {
                type:'dislike',
                userId:likeKarnewalaUserkiId,
                userDetails:user,
                postId,
                message:"Your post was dis liked"
            }
            const postOwnerScoketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerScoketId).emit('notification',notification);
        }


        return res.status(200).json({
            message:"Post disliked",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required', success:false});

        const comment = await Comment.create({
            text,
            author:commentKrneWalaUserKiId,
            post:postId,
            type:'string'
        })

        await comment.populate({
            path:'author',
            select:"username profilePicture"
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        
    const comments = await Comment.find({post:postId}).populate({
        path:"author",
        select:"username,profilePicture"
    })
    if(!comments) return res.status(404).json({message:"No comments found",success:false});

    return res.status(200).json({
        comments,
        success:true
    })
    } catch (error) {
        console.log(error);
        
    }
}

export const deletePost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"Post not found",success:false});
        
        //check if post belongs to user
        if(post.author.toString() !== authorId) return res.status(403).json({message:"Unauthorized",success:false});
        
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's posts
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        //delete associated comments
        await Comment.deletemany({post:postId});

        return res.status(200).json({
            message:"Post deleted",
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const bookmarkPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post  = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"Post not found",success:false});

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(postId)) 
        {
            // logic of already bookmarked
            await user.updateOne({$pull:{bookmarks:postId}});
            await user.save();
            return res.status(200).json({type:'unsaved',message:"Post removed from bookmarks",success:true});
        }
        else
        {
            // logic of not bookmarked
            await user.updateOne({$addToSet:{bookmarks:postId}});
            await user.save();
            return res.status(200).json({type:'saved',message:"Post saved to bookmarks",success:true});
        }
    } catch (error) {
        
    }
}