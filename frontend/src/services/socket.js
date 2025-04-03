import { io } from "socket.io-client";

// const URL = process.env.BACK_END_APP_URL || "https://toanthaybeebackendnodejs-17993696118.asia-southeast1.run.app"; // có thể dùng biến môi trường
const URL = process.env.BACK_END_APP_URL || "http://localhost:3000"; // có thể dùng biến môi trường

export const socket = io(URL, {
    autoConnect: false, // để chủ động connect khi cần
    withCredentials: true,
});
