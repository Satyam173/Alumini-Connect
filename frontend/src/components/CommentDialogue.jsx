import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "./ui/dialog"; // Added DialogTitle and DialogDescription
import { Avatar, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";

const CommentDialogue = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]); // Initialize with an empty array
  const dispatch = useDispatch();

  // Set comments based on the selectedPost
  useEffect(() => {
    if (selectedPost && selectedPost.comments) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  // Handle input change
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  // Handle comment submission
  const sendMessageHandler = async () => {
    console.log("Comment text:", text);
    console.log("Post ID:", selectedPost?._id);

    if (!text.trim()) {
      return toast.error("Comment cannot be empty.");
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost?._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Failed to send comment.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <DialogTitle>Comments Section</DialogTitle> {/* Added title for accessibility */}
        <DialogDescription>
          Add your comments below for the selected post.
        </DialogDescription> {/* Added description for accessibility */}

        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                    </Avatar>
                  </Link>
                </div>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer mr-3" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment?.length > 0 ? (
                comment.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  onChange={changeEventHandler}
                  value={text}
                  placeholder="Add a comment..."
                  className="w-full text-sm border-gray-300 outline-none p-2 rounded "
                />
                <Button
                  disabled={!text}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialogue;
