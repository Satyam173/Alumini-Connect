import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetUserProfile = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchUserProfile  = async ()=>{
            try{
                const res = await axios.get('http://localhost:8000/api/v1/user/suggested', {withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.posts);
                    dispatch(setSuggestedUsers(res.data.users))
                }
            }
       catch(err){
        console.log(err)
        }
    }
    fetchUserProfile();
    },[])
}

export default useGetUserProfile;
