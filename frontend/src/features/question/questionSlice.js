import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllQuestionAPI } from "../../services/questionApi";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";

export const fetchQuestions = createAsyncThunk(
    "questions/fetchQuestions",
    async ({ search, currentPage, limit, sortOrder }, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllQuestionAPI({ search, currentPage, limit, sortOrder });
            dispatch(setCurrentPage(response.data.currentPage));
            dispatch(setTotalPages(response.data.totalPages));
            dispatch(setTotalItems(response.data.totalItems));

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const questionSlice = createSlice({
    name: "questions",
    initialState: {
        questions: [],
        loading: false,
        error: null,
        isDetailView: localStorage.getItem("isDetailView") === "true",
        selectedQuestionId: localStorage.getItem("selectedQuestionId") || null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        resetDetailView: (state) => {
            state.isDetailView = false;
            state.selectedQuestionId = null;
            localStorage.removeItem("selectedQuestionId");
            localStorage.removeItem("isDetailView");
        },

        setDetailView: (state, action) => {
            state.isDetailView = true;
            state.selectedQuestionId = action.payload;
            localStorage.setItem("selectedQuestionId", action.payload);
            localStorage.setItem("isDetailView", true);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload.data;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setLoading, resetDetailView, setDetailView } = questionSlice.actions;
export default questionSlice.reducer;