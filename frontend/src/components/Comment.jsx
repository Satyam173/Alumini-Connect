import React from 'react'
import { Avatar, AvatarImage , AvatarFallback } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
          {console.log(comment.text)}
            <Avatar>
              <AvatarImage src = {comment?.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm'>{comment?.author.username} <span className='font-normal text-black pl-1'>{comment?.text}</span></h1>
        </div>
      
    </div>
  )
}

export default Comment;
