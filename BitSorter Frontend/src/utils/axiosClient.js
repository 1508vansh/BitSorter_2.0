import axios from 'axios';

const isLocal = process.env.PARCEL_IS_LOCAL === 'true';

// Determine backend base URL
  const BASE_URL = isLocal 
  ? process.env.PARCEL_LOCAL_SERVER_URL 
  : process.env.PARCEL_PROD_SERVER_URL;

  // console.log("This is req url man : ", BASE_URL)

const axiosClient = axios.create({
  //baseURL: 'http://localhost:5000',
  //baseURL:'https://bitsorter20-production-db0f.up.railway.app',
  //baseURL: 'https://bitsorter20-production.up.railway.app',
  baseURL:BASE_URL,
  withCredentials:true,
  headers: {
    'Content-type': 'application/json'
  }
});

export default axiosClient;
