// GoogleLoginBtn.js
import { GoogleLogin } from "@react-oauth/google"; // library component
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { loginGoogleUser } from "../slices/authSlice";

function GoogleLoginBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthorized } = useSelector((state) => state.auth);
  console.log("Rendering GoogleLoginBtn");
  useEffect(() => {
    if (isAuthorized) navigate("/");
  }, [isAuthorized, navigate]);

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log("onSucces :",credentialResponse.credential);
        dispatch(
          loginGoogleUser({ credential: credentialResponse.credential })
        );
      }}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
}

export default GoogleLoginBtn;
