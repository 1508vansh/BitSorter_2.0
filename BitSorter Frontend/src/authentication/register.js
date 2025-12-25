import React, { useEffect,useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import Loader from "../Ui/Loader";
import OAuthLoginPage from "./OAuthLogin";
import axiosClient from "../utils/axiosClient";
import VerificationCodeUI from "../Ui/VerificationCodeUI";

const schema = z.object({
  firstName: z.string().min(2, "Atleast two characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Atleast 6 characters"),
});

export default function Register() {
  const { isAuthorized } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [showVerificationCodeUI,setShowVerificationCodeUI] = useState(false);
  const [loadButton,setLoadButton] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  const onSubmit = async(data) => {
    try{
      setLoadButton(true);
    console.log("this is register data : ", data);
    await verifyUser(data);
    //dispatch(registerUser(data));
    }catch(err){
       console.log("can't even execute onsubmit!");
    }
  };

  //for verifying email -
  const verifyUser = async (registerData) => {
    try {
      const response = await axiosClient.post(
        "user/auth/verifyUser",
        registerData
      );
      setUserData(response.data.user);
      setShowVerificationCodeUI(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "Network error. Please try again.";
      console.log("error in registering!", message);
    }
  };

  return (
    <div className="h-screen bg-sky-50 w-screen flex flex-col gap-2 justify-center items-center">
      <div className="font-medium text-4xl">Register</div>
      {
        showVerificationCodeUI ? <VerificationCodeUI userData={userData}/>
        :
        <div className="w-72 border-t-8 border-indigo-500 shadow flex flex-col rounded-xl bg-white p-10 gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1"
          noValidate
        >
          <div>
            <label className="font-semibold">First-Name</label>
            <input
              className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p style={{ color: "red" }}>{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">Email</label>
            <input
              className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="font-semibold">Passwod</label>
            <input
              className="border-2 px-2 py-1 rounded-sm border-gray-200 outline-none"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-center items-center mt-2">
            <button
              type="submit"
              className="rounded-sm bg-purple-500 py-2 px-2.5 text-white"
            >
              {loadButton?<Loader width={25}/>:'Register'}
            </button>
          </div>
          <p className="text-gray-400">
            Already a user?{" "}
            <Link className="text-blue-400 underline" to={"/login"}>
              Login
            </Link>{" "}
          </p>
        </form>
      </div>
      }
      {<OAuthLoginPage /> || <Loader/>}
    </div>
  );
}
