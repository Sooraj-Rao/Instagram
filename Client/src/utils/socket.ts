import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

export default socket;
