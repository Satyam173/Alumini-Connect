import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchSuggestedUsers  = async ()=>{
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
    fetchSuggestedUsers();
    },[])
}

export default useGetSuggestedUsers;
