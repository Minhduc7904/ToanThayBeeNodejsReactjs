import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as examApi from "../../services/examApi";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";

export const fetchExams = createAsyncThunk(
    "exams/fetchExams",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, examApi.getAllExamAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, true, false);
    }
);

export const fetchExamById = createAsyncThunk(
    "exams/fetchExamById",
    async (id, {dispatch}) => {
        return await apiHandler(dispatch, examApi.getExamByIdAPI, id, ()=>{}, true, false);
    }
);

export const putExam = createAsyncThunk(
    "exams/putExam",
    async ({ examId, examData }, {dispatch}) => {
        return await apiHandler(dispatch, examApi.putExamAPI, {examId, examData}, ()=>{}, true, false);
    }
);

export const putImageExam = createAsyncThunk(
    "exams/putImageExam",
    async ({ examId, examImage }, {dispatch}) => {
        return await apiHandler(dispatch, examApi.putImageExamAPI, {examId, examImage},()=>{}, true, false);
    }
);

export const postExam = createAsyncThunk(
    "exams/postExam",
    async ({ examData, examImage, questions, questionImages, statementImages }, {dispatch}) => {
        return await apiHandler(dispatch, examApi.postExamAPI, { examData, examImage, questions, questionImages, statementImages }, ()=>{}, true, false);
    }
);

export const deleteExam = createAsyncThunk(
    "exams/deleteExam",
    async (id, {dispatch}) => {
        return await apiHandler(dispatch, examApi.deleteExamAPI, id, ()=>{}, true, false);
    }
);

const examSlice = createSlice({
    name: "exams",
    initialState: {
        exams: [],
        exam: null,
    },
    reducers: {
        setExam: (state, action) => {
            state.exam = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.pending, (state) => {
                state.exams = [];
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exams = action.payload.data;
                }
            })
            .addCase(fetchExamById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.exam = action.payload.data;
                }
            })
    }
});

export const { setExam } = examSlice.actions;
export default examSlice.reducer;