import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, logoutAPI, checkLoginAPI } from "../../services/authApi.js";

// Thunk đăng nhập
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginAPI(credentials);
            const { user } = response.data; // API trả về { user }
            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Đăng nhập thất bại");
        }
    }
);

// Thunk kiểm tra đăng nhập
export const checkLogin = createAsyncThunk(
    "auth/checkLogin",
    async (_, { rejectWithValue }) => {
        try {
            const response = await checkLoginAPI();
            return response.data.user; // API trả về { user }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Không thể xác thực");
        }
    }
);

// Thunk đăng ký
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerAPI(userData);
            const { user } = response.data;
            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Đăng ký thất bại");
        }
    }
);

// Thunk đăng xuất
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await logoutAPI();
            return; // Chỉ cần xóa user khỏi state
        } catch (error) {
            return rejectWithValue(error.response?.data || "Đăng xuất thất bại");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false, // Mặc định loading để checkLogin chạy
        error: null,
        isChecking: true, // Dùng để biết lần đầu checkLogin có đang chạy không

    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // Xử lý login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isChecking = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Xử lý checkLogin
            .addCase(checkLogin.pending, (state) => {
                state.loading = true;
                state.isChecking = true;
            })
            .addCase(checkLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isChecking = false; // Chỉ set false khi API hoàn tất
                state.user = action.payload;
            })
            .addCase(checkLogin.rejected, (state) => {
                state.loading = false;
                state.isChecking = false;
                state.user = null;
            })

            // Xử lý register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Xử lý logout
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
        });
},
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
