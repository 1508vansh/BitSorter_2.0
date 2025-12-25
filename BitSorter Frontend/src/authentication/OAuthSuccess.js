import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authenticateUser } from "../slices/authSlice";
import { useNavigate } from "react-router";
import Loader from '../Ui/Loader';

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
     try{
       dispatch(authenticateUser());
        navigate('/');
      }catch(err){
        navigate('/login');
      }   
    }
    fetchUserData();
  }, []);

  return <Loader/>;
};

export default OAuthSuccess;
