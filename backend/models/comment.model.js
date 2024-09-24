import mongoose from "mongoose";
import { User } from "./user.model.js";

const commentScehma = new mongoose.Schema({
    type:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    post:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
});
export const Comment = mongoose.model("Comment",commentScehma);