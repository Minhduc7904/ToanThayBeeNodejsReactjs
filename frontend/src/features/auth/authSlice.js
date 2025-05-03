import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, logoutAPI, checkLoginAPI, updateAvatarAPI, updateUserAPI, getUserMeAPI } from "../../services/authApi.js";
import { setErrorMessage, setSuccessMessage } from "../state/stateApiSlice.js"; // Import action setErrorMessage từ errorSlice
import { apiHandler } from "../../utils/apiHandler.js"; // Import apiHandler từ utils

// Thunk đăng nhập
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            const response = await loginAPI(credentials);
            const { user, token } = response.data; // API trả về { user, token }

            // Lưu token vào localStorage để sử dụng trong trường hợp cookie không được hỗ trợ
            if (token) {
                localStorage.setItem('auth_token', token);
            }

            return user;
        } catch (error) {
            const errorMsg = error.response?.data.message || "Đăng nhập thất bại";
            dispatch(setErrorMessage(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

// Thunk kiểm tra đăng nhập
export const checkLogin = createAsyncThunk(
    "auth/checkLogin",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await checkLoginAPI();
            return response.data.user; // API trả về { user }
        } catch (error) {
            const errorMsg = error.response?.data.message || "Không thể xác thực";
            // dispatch(setErrorMessage(errorMsg));
            return
        }
    }
);

// Thunk đăng ký
export const register = createAsyncThunk(
    "auth/register",
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            const response = await registerAPI(userData);
            const { user } = response.data;
            return user;
        } catch (error) {
            const errorMsg = error.response?.data.message || "Đăng ký thất bại";
            dispatch(setErrorMessage(errorMsg));
            return
        }
    }
);

// Thunk đăng xuất
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await logoutAPI();
            // Xóa token khỏi localStorage khi đăng xuất
            localStorage.removeItem('auth_token');
            // dispatch(setSuccessMessage("Đăng xuất thành công"));
            return; // Chỉ cần xóa user khỏi state
        } catch (error) {
            // const errorMsg = error.response?.data || "Đăng xuất thất bại";
            // dispatch(setErrorMessage(errorMsg));
            return
        }
    }
);

export const updateAvatar = createAsyncThunk(
    "auth/updateAvatar",
    async (avatar, { dispatch }) => {
        return await apiHandler(dispatch, updateAvatarAPI, { avatar }, () => {
            dispatch(setSuccessMessage("Cập nhật ảnh đại diện thành công"));
        }, true);
    }
);

export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async (user, { dispatch }) => {
        return await apiHandler(dispatch, updateUserAPI, user, () => {
            dispatch(setSuccessMessage("Cập nhật thông tin thành công"));
        }, true);
    }
);

// Thêm action kiểm tra token và nguồn gửi token
export const testTokenSource = createAsyncThunk(
    "auth/testTokenSource",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await getUserMeAPI();
            const { hasTokenInCookie, hasTokenInHeader, tokenSource } = response.data;

            // Hiển thị thông báo về nguồn token
            let message = "Kiểm tra token: ";
            if (tokenSource === 'cookie') {
                message += "Sử dụng cookie để gửi token";
            } else if (tokenSource === 'header') {
                message += "Sử dụng header để gửi token";
            } else {
                message += "Không tìm thấy token";
            }

            console.log(message);

            dispatch(setSuccessMessage(message));

            return { hasTokenInCookie, hasTokenInHeader, tokenSource };
        } catch (error) {
            const errorMsg = error.response?.data.message || "Không thể kiểm tra token";
            dispatch(setErrorMessage(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

// Thêm action mới
export const checkLoginIfNeeded = createAsyncThunk(
    "auth/checkLoginIfNeeded",
    async (_, { dispatch, getState, rejectWithValue }) => {  // Thêm rejectWithValue vào đây
        const CACHE_DURATION = 5 * 60 * 1000; // 5 phút
        const lastCheck = localStorage.getItem('lastLoginCheck');
        const now = Date.now();

        // Kiểm tra cache
        if (lastCheck && (now - parseInt(lastCheck) < CACHE_DURATION)) {
            const cachedUser = localStorage.getItem('cachedUser');
            if (cachedUser) {
                return JSON.parse(cachedUser);
            }
        }

        // Nếu không có cache hoặc cache hết hạn, gọi API
        try {
            const response = await checkLoginAPI();
            const user = response.data.user;

            // Cập nhật cache
            localStorage.setItem('lastLoginCheck', now.toString());
            localStorage.setItem('cachedUser', JSON.stringify(user));

            return user;
        } catch (error) {
            localStorage.removeItem('lastLoginCheck');
            localStorage.removeItem('cachedUser');
            return rejectWithValue(error);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,       // Đang load thông tin đăng nhập, đăng ký hay checkLogin
        isChecking: true,     // Dùng để biết lần đầu checkLogin có đang chạy không
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Xử lý login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.isChecking = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state) => {
                state.loading = false;
            })

            // Xử lý checkLogin
            .addCase(checkLogin.pending, (state) => {
                state.loading = true;
                state.isChecking = true;
            })
            .addCase(checkLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isChecking = false;
                state.user = action.payload;
            })
            .addCase(checkLogin.rejected, (state) => {
                state.loading = false;
                state.isChecking = false;
                state.user = null;
            })

            // Xử lý logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })

            .addCase(updateAvatar.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.avatarUrl = action.payload.newAvartarUrl;
                }
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                if (state.user) {
                    state.user = { ...state.user, ...action.payload.data };
                }
            })

            // Xử lý testTokenSource
            .addCase(testTokenSource.pending, (state) => {
                state.loading = true;
            })
            .addCase(testTokenSource.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(testTokenSource.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
