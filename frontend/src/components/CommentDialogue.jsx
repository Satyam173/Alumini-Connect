import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
const CommentDialogue = ({ open, setOpen }) => {
    const [text,setText] = useState("");

    const changeEventHandler = (e)=>{
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");
        }
    }

    const sendMessageHandler = async ()=>{
        alert(text);
    }
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://images.unsplash.com/photo-1726715245558-69afa5ded798?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D"
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
                    <AvatarImage src="https://images.unsplash.com/photo-1726715245558-69afa5ded798?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D" />
                  </Avatar>
                </Link>
                </div>
                <div>
                  <Link className="font-semibold text-xs">username</Link>
                  {/* <span className="text-sm text-gray-500">Bio here...</span> */}
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer mr-3"/>
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center text-center">
                <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                </div>
                <div className="cursor-pointer w-full ">
                    Add to favorites
                </div>
              </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
                Comments ayenge
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2">
                <input type="text" onChange={changeEventHandler} value={text} placeholder="Add a comment..." className="w-full border-gray-300 outline-none p-2 rounded "/>
                <Button disabled={!text} onClick={sendMessageHandler} variant="outline">Send</Button>
                </div> 
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialogue;
