import React from "react";
// import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
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
        navigate("/login");
        setInput({
            username: "",
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
  return (
    <div className="flex w-screen items-center justify-center h-screen">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-xl text-center font-bold">Logo</h1>

          <p className="text-center text-sm">
            Signup to connect to your batchmates.
          </p>
        </div>
        <div>
          {/* <Label className='py-2'>Username</Label> */}
          <span className="py-2 font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
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
            <Button type="submit" >Signup</Button>
          )
        }

        
        <span className="text-center">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></span>
      </form>
    </div>


  );
};

export default Signup;
