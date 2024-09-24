import mongoose from "mongoose";

const messageScehma = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    message:{type:String,required:true}
});
export const Message = mongoose.model("Message",messageScehma);