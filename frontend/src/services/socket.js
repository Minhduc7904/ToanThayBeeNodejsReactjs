import { io } from "socket.io-client";

const URL = "http://localhost:3000"; // có thể dùng biến môi trường

export const socket = io(URL, {
    autoConnect: false, // để chủ động connect khi cần
    withCredentials: true,
});
