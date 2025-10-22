import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
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