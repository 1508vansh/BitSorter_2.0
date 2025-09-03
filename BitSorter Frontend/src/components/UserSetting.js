import { useNavigate } from "react-router";
import { logoutUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {Link} from "react-router";
import axiosClient from "../utils/axiosClient";
const UserLogo = new URL("../assets/UserLogo.png", import.meta.url).href;
import RadialStats from "../Ui/RadialStats";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import Loader from "../Ui/Loader";

export default function UserSettings({user}) {
  const [isUploading, setIsUploading] = useState(false);

  const [preview, setPreview] = useState(user?.avatarUrl || UserLogo);
  const [file, setFile] = useState(null);
  const [userName,setUserName] = useState(user?.firstName);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleUpload = async () => {
    if (!file && !userName) {
      alert("Enter name and select an image");
      return;
    }

    const formData = new FormData();
    if(file)
    formData.append("avatar", file);

    try {
      if(file){
      const res = await axiosClient.post("user/auth/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
       console.log("This is frontend res!", res);
      console.log(res.data);
     }
      // to change the name...
      if(userName){
      const changeNameRes = await axiosClient.post("user/auth/change/firstName",{name:userName});
      console.log("Name changed successfull",changeNameRes);
      }
      alert("Upload successfull!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className={`text-2xl font-semibold mb-6 text-center text-black`}>Edit Profile</h2>

      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 mb-4">
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border"
          />
        </div>
          <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
      >
        Change Photo
      </label>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-black">Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 text-black border rounded border-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
         onClick={() => {
          setIsUploading(true), handleUpload();
        }}
        disabled={isUploading}
        className="w-full btn btn-secondary"
      >
        Save Changes
      </button>
    </div>
    <div>

      {/* Display file name */}
      <p className="mt-2 text-gray-600"></p>
    </div>
    </>
  );
}
