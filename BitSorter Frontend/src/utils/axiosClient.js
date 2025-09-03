import axios from 'axios';
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
  //baseURL: 'https://bitsorter.onrender.com',
  withCredentials:true,
  headers: {
    'Content-type': 'application/json'
  }
});

export default axiosClient;