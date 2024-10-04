import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile,setUserProfile] = useState(null);
    useEffect(()=>{
        const fetchUserProfile  = async ()=>{
            try{
                const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, {withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.posts);
                    dispatch(setUserProfile(res.data.users))
                }
            }
       catch(err){
        console.log(err)
        }
    }
    fetchUserProfile();
    },[userId])
}

export default useGetUserProfile;
