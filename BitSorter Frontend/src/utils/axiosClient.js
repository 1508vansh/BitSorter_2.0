import axios from 'axios';
const axiosClient = axios.create({
  //baseURL: 'http://localhost:5000',
  baseURL: 'https://bitsorter-2-0-nnjg.onrender.com',
  // baseURL: 'https://bitsorter-production.up.railway.app',
  withCredentials:true,
  headers: {
    'Content-type': 'application/json'
  }
});

export default axiosClient;
