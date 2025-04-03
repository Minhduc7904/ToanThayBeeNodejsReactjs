import axios from 'axios';
import applyRequestInterceptor from './requestInterceptor';
import applyResponseInterceptor from './responseInterceptor';

// Tạo một instance của Axios
const api = axios.create({
    // baseURL: process.env.REACT_APP_API_URL || "https://toanthaybeebackendnodejs-17993696118.asia-southeast1.run.app/api",
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",

    timeout: 100000,
    withCredentials: true, // Gửi kèm cookies với mỗi request
});


// Áp dụng Interceptors
applyRequestInterceptor(api);
applyResponseInterceptor(api);

export default api;
