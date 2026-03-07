import { io } from "socket.io-client";

// Backend URL from environment variable
const BACKEND_URL =
  process.env.REACT_APP_API_URL ||
  "https://voting-system-backend-b9y7.onrender.com";

// Create socket connection
const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default socket;
