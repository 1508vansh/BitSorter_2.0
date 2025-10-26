import { io } from "socket.io-client";

const socket = io("https://bitsorter-2-0-nnjg.onrender.com", {
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
