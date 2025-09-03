// GoogleLoginWrapper.js
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginBtn from "./GoogleLoginBtn";

const GoogleLoginWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <GoogleLoginBtn />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginWrapper;
