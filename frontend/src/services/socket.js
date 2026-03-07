import { io } from 'socket.io-client';

// Single shared socket connection to the backend
const socket = io('https://voting-system-backend-b9y7.onrender.com', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default socket;
