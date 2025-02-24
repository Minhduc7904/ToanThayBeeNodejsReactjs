import axios from 'axios'

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000', // Thay bằng URL backend của bạn
    withCredentials: true, // Cho phép gửi và nhận cookie
    headers: {
        'Content-Type': 'application/json',
    },
})

export default axiosClient