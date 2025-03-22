import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    errorsMessage: "",
    loading: false,
    successMessage: "" // Lưu thông báo thành công
};

const stateSlice = createSlice({
    name: 'states',
    initialState,
    reducers: {
        // Thêm một lỗi mới vào danh sách
        setErrorMessage: (state, action) => {
            state.errorsMessage = action.payload;
        },
        // Xóa tất cả lỗi
        clearErrorsMessage: (state) => {
            state.errorsMessage = "";
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
            state.errors = "";
        }
    }
});

export const { setErrorMessage, clearErrorsMessage, setLoading, setSuccessMessage, clearSuccessMessage, resetState } = stateSlice.actions;
export default stateSlice.reducer;
