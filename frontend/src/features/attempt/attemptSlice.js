
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiHandler } from "../../utils/apiHandler";
import { getAttemptsByExamIdApi, getAttemptByStudentIdApi, getAttemptByExamIdAdminApi } from "../../services/attemptApi";
import { setExam } from "../exam/examSlice";
import { setCurrentPage, setLimit, setTotalItems } from "../filter/filterSlice";

export const fetchAttemptsByExamId = createAsyncThunk(
    "attempts/fetchAttemptsByExamId",
    async ({ examId, currentPage }, { dispatch }) => {
        return await apiHandler(dispatch, getAttemptsByExamIdApi, { examId, currentPage }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalItems(data.totalItems));
            dispatch(setLimit(data.limit));
            dispatch(setExam(data.exam));
        }, true, false);
    }
);

export const fetchAttemptByStudentId = createAsyncThunk(
    "attempts/fetchAttemptByStudentId",
    async ({ examId }, { dispatch }) => {
        return await apiHandler(dispatch, getAttemptByStudentIdApi, { examId }, (data) => {
            dispatch(setExam(data.exam));
            dispatch(setCurrentPage(1));
            dispatch(setLimit(10));
        }, true, false);
    }
);

export const fetchAttemptByExamIdAdmin = createAsyncThunk(
    "attempts/fetchAttemptByExamIdAdmin",
    async ({ examId, search = "", currentPage = 1, limit = 10 }, { dispatch }) => {
        return await apiHandler(dispatch, getAttemptByExamIdAdminApi, { examId, search, currentPage, limit }, (data) => {
            dispatch(setCurrentPage(data.data.currentPage));
            dispatch(setTotalItems(data.data.totalItems));
            dispatch(setLimit(data.data.limit));
            console.log("data", data);
        }, true, false);
    }
);

const attemptSlice = createSlice({
    name: "attempts",
    initialState: {
        attempts: [],
    },
    reducers: {
        setAttempts: (state, action) => {
            state.attempts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttemptsByExamId.pending, (state) => {
                state.attempts = [];
            })
            .addCase(fetchAttemptsByExamId.fulfilled, (state, action) => {
                if (action.payload) {
                    state.attempts = action.payload.attempts;
                }
            })
            .addCase(fetchAttemptByStudentId.pending, (state) => {
                state.attempts = [];
            })
            .addCase(fetchAttemptByStudentId.fulfilled, (state, action) => {
                if (action.payload) {
                    state.attempts = action.payload.data;
                }
            })
            .addCase(fetchAttemptByExamIdAdmin.pending, (state) => {
                state.attempts = [];
            })
            .addCase(fetchAttemptByExamIdAdmin.fulfilled, (state, action) => {
                if (action.payload) {
                    state.attempts = action.payload.data.data;
                }
            });
    },
});

export const { setAttempts } = attemptSlice.actions;
export default attemptSlice.reducer;
