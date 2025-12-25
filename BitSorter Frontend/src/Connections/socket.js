import { io } from "socket.io-client";
//https://bitsorter20-production.up.railway.app
const socket = io("https://bitsorter20-production.up.railway.app", {
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
