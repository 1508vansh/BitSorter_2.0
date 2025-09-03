import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from 'react-redux';
import {loginUser} from '../slices/authSlice';
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import GoogleLoginWrapper from "./GoogleLoginWrapper";
import Loader from "../Ui/Loader";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Atleast 6 characters"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {isAuthorized} = useSelector((state)=>state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  console.log("login isauth check : ",isAuthorized);

    useEffect(()=>{
      console.log(isAuthorized);
      if(isAuthorized){
        navigate('/');
        setError(err);
      }
    },[isAuthorized,navigate]);

  const onSubmit = async(data) => {
     try{
      console.log("this is data : ",data);
      const res = await dispatch(loginUser(data)).unwrap();
      navigate('/');
     }catch(err){
        setError(err);
     }
  };

  return (
      <div className="h-screen bg-sky-50 w-screen flex flex-col gap-3 justify-center items-center">
        <div className="font-medium text-2xl">Login To Your Account</div>
    <div className="w-72 border-t-8 border-indigo-500 shadow flex flex-col rounded-xl bg-white p-10 gap-2">
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1" noValidate>
      <div>
        <label className="font-semibold">Email</label>
        <input className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none" {...register("email")} />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>
      <div>
        <label className="font-semibold">Passwod</label>
        <input className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none" type="password" {...register("password")} />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
      </div>
      <div className="flex justify-center items-center mt-2">
      <button type="submit" className="rounded-sm bg-purple-500 py-2 px-2.5 text-white">Login</button>
      </div>
      <p className="text-gray-400">New User? <Link className="text-blue-400 underline" to={'/register'}>register</Link> </p>
    </form>
     {error && 
     <div>
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Wrong Credentials ! Can't Login.</span>
        </div>
    </div>}
     </div>
         {<GoogleLoginWrapper/> || <Loader/>}
       </div>
  );
}