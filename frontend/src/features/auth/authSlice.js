// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, logoutAPI } from '../../services/authApi.js';

// Thunk đăng nhập
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginAPI(credentials);
            // Giả sử API trả về: { user } và server đã set HttpOnly cookie chứa token
            const { user } = response.data;
            return user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk đăng ký
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerAPI(userData);
            // Giả sử API trả về: { user } và server set cookie
            const { user } = response.data;
            return user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk đăng xuất
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logoutAPI();
            return; // Không cần trả về gì, chỉ clear state
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Có thể bổ sung các reducer đồng bộ nếu cần
    },
    extraReducers: (builder) => {
        // Xử lý login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Xử lý register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Xử lý logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
        });
    },
});

export default authSlice.reducer;
