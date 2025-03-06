// src/services/authAPI.js
import api from './api';

// Gọi API đăng ký
export const registerAPI = (userData) => api.post('/v1/user/register', userData);

// Gọi API đăng nhập
export const loginAPI = (credentials) => api.post('/v1/user/login', credentials);

// Gọi API đăng xuất
export const logoutAPI = () => api.post('/v1/user/logout');

export const checkLoginAPI = () => api.get('/v1/user/check-login');