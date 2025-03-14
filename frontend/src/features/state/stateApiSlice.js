import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    errors: [],
    loading: false,
    successMessage: "" // Lưu thông báo thành công
};

const stateSlice = createSlice({
    name: 'states',
    initialState,
    reducers: {
        // Đặt danh sách lỗi
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        // Thêm một lỗi mới vào danh sách
        addError: (state, action) => {
            state.errors.push(action.payload);
        },
        // Xóa tất cả lỗi
        clearErrors: (state) => {
            state.errors = [];
        },
        // Bật/tắt trạng thái loading
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Đặt thông báo thành công
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        // Xóa thông báo thành công
        clearSuccessMessage: (state) => {
            state.successMessage = "";
        },
        // Reset toàn bộ state
        resetState: (state) => {
            state.loading = false;
            state.successMessage = "";
            state.errors = [];
        }
    }
});

export const { setErrors, addError, clearErrors, setLoading, setSuccessMessage, clearSuccessMessage, resetState } = stateSlice.actions;
export default stateSlice.reducer;
