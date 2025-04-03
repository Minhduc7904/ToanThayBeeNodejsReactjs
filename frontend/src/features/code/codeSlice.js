import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCodeByTypeAPI, getAllCodesAPI, createCodeAPI, putCodeAPI } from "../../services/codeApi";
import { setErrorMessage } from "../state/stateApiSlice"; // Import từ stateApiSlice
import { apiHandler } from "../../utils/apiHandler";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";

// 🎯 Action bất đồng bộ để lấy danh sách mã code theo type
export const fetchCodesByType = createAsyncThunk(
    "codes/fetchCodesByType",
    async (types, { dispatch }) => {
        return await apiHandler(dispatch, getCodeByTypeAPI, types, (data) => {
            if (!data || !Array.isArray(data.data)) {
                dispatch(setErrorMessage("Dữ liệu nhận được không hợp lệ"));
                return;
            }
        }, false, false);
    }
);

export const fetchAllCodes = createAsyncThunk(
    "codes/fetchAllCodes",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, getAllCodesAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, true, false);
    }
);

export const createCode = createAsyncThunk(
    "codes/createCode",
    async (code, { dispatch }) => {
        return await apiHandler(dispatch, createCodeAPI, code, (data) => {
        }, true, false);
    }
);

export const putCode = createAsyncThunk(
    "codes/putCode",
    async (code, { dispatch }) => {
        return await apiHandler(dispatch, putCodeAPI, code, (data) => {
        }, true, false);
    }
);



// 🌟 Tạo Slice Redux cho codes
const codeSlice = createSlice({
    name: "codes",
    initialState: {
        codes: {},
        allCodes: []
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
            .addCase(fetchAllCodes.pending, (state) => {
                state.allCodes = [];
            })
            .addCase(fetchAllCodes.fulfilled, (state, action) => {
                state.allCodes = action.payload.data;
            });
    }
});

export const { clearCodes } = codeSlice.actions;
export default codeSlice.reducer;
