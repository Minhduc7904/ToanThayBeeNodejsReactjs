
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiHandler } from "../../utils/apiHandler";
import { getAttemptsByExamIdApi, getAttemptByStudentIdApi, getAttemptByUser, getAttemptByExamIdAdminApi } from "../../services/attemptApi";
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
        }, false, false);
    }
);

export const fetchAttemptsByUser = createAsyncThunk(
    "attempts/fetchAttemptsByUser",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, getAttemptByUser, data, (data) => {
            dispatch(setCurrentPage(data.data.currentPage));
            dispatch(setTotalItems(data.data.totalItems));
        }, false, false);
    }
);

export const fetchAttemptByStudentId = createAsyncThunk(
    "attempts/fetchAttemptByStudentId",
    async ({ examId }, { dispatch }) => {
        return await apiHandler(dispatch, getAttemptByStudentIdApi, { examId }, (data) => {
            dispatch(setExam(data.exam));
            dispatch(setCurrentPage(1));
            dispatch(setLimit(10));
        }, false, false);
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
        bestAttempt: null,
        userRank: null,
        userAttemptCount: null,
        loadingAttempt: false,
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
                state.bestAttempt = null;
                state.userRank = null;
                state.userAttemptCount = null;
            })
            .addCase(fetchAttemptsByExamId.fulfilled, (state, action) => {
                if (action.payload) {
                    state.attempts = action.payload.attempts;
                    state.bestAttempt = action.payload.userBestAttempt;
                    state.userRank = action.payload.userRank;
                    state.userAttemptCount = action.payload.userAttemptCount;
                }
            })
            .addCase(fetchAttemptsByUser.pending, (state) => {
                state.attempts = [];
                state.loadingAttempt = true;
            })
            .addCase(fetchAttemptsByUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.attempts = action.payload.data.data;
                }
                state.loadingAttempt = false;
            })
            .addCase(fetchAttemptsByUser.rejected, (state) => {
                state.loadingAttempt = false;
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
