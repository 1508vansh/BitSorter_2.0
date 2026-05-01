import { io } from "socket.io-client";
//const url = 'https://bitsorter20-production.up.railway.app';
//const url = 'http://localhost:5000';
//const url = "https://bitsorter20-production.up.railway.app";
const isLocal = process.env.PARCEL_IS_LOCAL === 'true';
console.log("isLocal : ",isLocal)

const SOCKET_URL = isLocal
  ? process.env.PARCEL_LOCAL_SERVER_URL
  : process.env.PARCEL_PROD_SERVER_URL;

// console.log("This is socket_url ",SOCKET_URL)

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket']
});


socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server:", socket.id);
});
socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;
