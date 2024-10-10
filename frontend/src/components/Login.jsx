import React, { useEffect } from "react";
// import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";

const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {

          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        setInput({
            email: "",

            password: "",
          });
      }
      console.log(res);

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  },[])

  return (
    <div className="flex w-screen items-center justify-center h-screen">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-xl text-center font-bold">Logo</h1>

          <p className="text-center text-sm">
            Login to connect to your batchmates.
          </p>
        </div>
        <div>
          {/* <Label className='py-2'>Username</Label> */}
          <span className="py-2 font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          {/* <Label className='py-2'>Username</Label> */}
          <span className="py-2 font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>

        {
          loading ? (
            <Button ><Loader2 className="mr-2 h-4 w-4 animate-spin"/>please wait</Button>
          ):(
            <Button type="submit" >Login</Button>
          )
        }
        
        <span className="text-center">Don&apos;t have an account? <Link to="/signup" className="text-blue-500">Signup</Link></span>
      </form>
    </div>
  );
};

export default Login;
