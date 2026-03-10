import { io } from "socket.io-client";
//https://bitsorter20-production.up.railway.app
//'http://localhost:5000
const url = "https://bitsorter20-production.up.railway.app";
const socket = io(url, {
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
