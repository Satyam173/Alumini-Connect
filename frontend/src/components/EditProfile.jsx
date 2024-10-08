import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";

const EditProfile = () => {
    const {user} = useSelector(store=>store.auth);
  return (
    <div className="flex max-w-2xl pl-10"> 
      <section>
        <h1 className="font-bold text-xl">Edit profile</h1>
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user?._id}`}>
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                alt="user_profile_image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <span className="text-gray-600 text-sm">
              {user?.bio || "Bio here ..."}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
