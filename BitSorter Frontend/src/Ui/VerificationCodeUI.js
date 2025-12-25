import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../slices/authSlice";
import Loader from "./Loader";

export default function VerificationCodeUI({userData}) {
  const [code, setCode] = useState("");
  const [buttonLoader,setButtonLoader] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    setButtonLoader(true);
    e.preventDefault();
    const registerData = {
        ...userData,
        verificationCode:code
    }
    // call code verification API here
    dispatch(registerUser(registerData));
    console.log("data code:", code);
  };

  return (
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800">
          Verify your email
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          Enter the 6-digit verification code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="mt-5">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="w-full px-4 py-2 border rounded-md text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            {buttonLoader?<Loader width={25}/>:'Verify'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Didn’t receive the code? Check your spam folder.
        </p>
      </div>
  );
}
