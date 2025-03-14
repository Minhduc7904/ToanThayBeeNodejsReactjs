import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCodeByTypeAPI } from "../../services/codeApi";
import { addError } from "../state/stateApiSlice"; // Import từ stateApiSlice
import { apiHandler } from "../../utils/apiHandler";

// 🎯 Action bất đồng bộ để lấy danh sách mã code theo type
export const fetchCodesByType = createAsyncThunk(
    "codes/fetchCodesByType",
    async (types, { dispatch }) => {
        return await apiHandler(dispatch, getCodeByTypeAPI, types, (data) => {
            if (!data || !Array.isArray(data.data)) {
                dispatch(addError("Dữ liệu nhận được không hợp lệ"));
                return;
            }
        }, false);
    }
);



// 🌟 Tạo Slice Redux cho codes
const codeSlice = createSlice({
    name: "codes",
    initialState: {
        codes: {}, // Lưu dữ liệu theo từng type
    },
    reducers: {
        // 🧹 Xóa dữ liệu mã code
        clearCodes: (state) => {
            state.codes = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCodesByType.fulfilled, (state, action) => {
                const { data } = action.payload;
                const formattedCodes = {};
                data.forEach(({ type, code, description }) => {
                    if (!formattedCodes[type]) {
                        formattedCodes[type] = [];
                    }
                    formattedCodes[type].push({ code, description });
                });

                if (action.payload) {
                    state.codes = formattedCodes
                }
            })
            .addCase(fetchCodesByType.rejected, () => { }); // Lỗi đã được xử lý ở stateApiSlice
    }
});

export const { clearCodes } = codeSlice.actions;
export default codeSlice.reducer;
