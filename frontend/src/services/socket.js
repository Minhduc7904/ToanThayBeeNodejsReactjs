import { io } from "socket.io-client";

const URL = process.env.BACK_END_APP_URL 

export const socket = io(URL, {
    autoConnect: false, // để chủ động connect khi cần
    withCredentials: true,
});
