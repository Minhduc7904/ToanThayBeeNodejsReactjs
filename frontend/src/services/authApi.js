// src/services/authAPI.js
import api from './api';

// Gọi API đăng ký
export const registerAPI = (userData) => api.post('/v1/user/register', userData);

// Gọi API đăng nhập
export const loginAPI = (credentials) => api.post('/v1/user/login', credentials);

// Gọi API đăng xuất
export const logoutAPI = () => api.post('/v1/user/logout');

export const checkLoginAPI = () => api.get('/v1/user/check-login');

// API kiểm tra token và nguồn gửi token (cookie hoặc header)
export const getUserMeAPI = () => api.get('/v1/user/me');

export const updateUserAPI = (user) => {
    return api.put(`/v1/user`, user);
}

export const updateAvatarAPI = ({ avatar }) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return api.put(`/v1/user/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
