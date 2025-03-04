import axios from 'axios';
import applyRequestInterceptor from './requestInterceptor';
import applyResponseInterceptor from './responseInterceptor';

// Tạo một instance của Axios
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    withCredentials: true, // Gửi kèm cookies với mỗi request
});

console.log("🚀 Đang khởi tạo Axios Instance");


// Áp dụng Interceptors
applyRequestInterceptor(api);
applyResponseInterceptor(api);

export default api;
