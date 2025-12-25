import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { Link, useNavigate } from "react-router";
import Loader from "../Ui/Loader";
import OAuthLoginPage from "./OAuthLogin";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "At least 6 characters"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthorized } = useSelector((state) => state.auth);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Navigate to home if logged in
  useEffect(() => {
    if (isAuthorized) {
      navigate('/');
    }
  }, [isAuthorized, navigate]);

  const onSubmit = async (data) => {
    try {
      console.log("Login data: ", data);
      await dispatch(loginUser(data)).unwrap();
      navigate('/');
    } catch (err) {
      alert("Check Your Email or Password!")
      setError(true); // Display error from backend
    }
  };
  console.log("Render Login Component Error : ",error);
  return (
    <div className="h-screen bg-sky-50 w-screen flex flex-col gap-3 justify-center items-center">
      <div className="font-medium text-2xl">Login To Your Account</div>
      <div className="w-72 border-t-8 border-indigo-500 shadow flex flex-col rounded-xl bg-white p-10 gap-2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1" noValidate>
          <div>
            <label className="font-semibold">Email</label>
            <input
              className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none"
              {...register("email")}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
          </div>
          <div>
            <label className="font-semibold">Password</label>
            <input
              className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none"
              type="password"
              {...register("password")}
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
          </div>
          <div className="flex justify-center items-center mt-2">
            <button type="submit" className="rounded-sm bg-purple-500 py-2 px-2.5 text-white">
              Login
            </button>
          </div>
          <p className="text-gray-400">
            New User? <Link className="text-blue-400 underline" to={'/register'}>Register</Link>
          </p>
        </form>

      </div>
      {<OAuthLoginPage /> || <Loader />}
    </div>
  );
}
