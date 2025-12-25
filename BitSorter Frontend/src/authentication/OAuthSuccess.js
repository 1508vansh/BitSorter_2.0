import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../slices/authSlice";
import { useNavigate } from "react-router";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
     try{
       dispatch(authenticateUser);
        navigate('/');
      }catch(err){
        navigate('/login');
      }   
    }
    fetchUserData();
  }, []);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
