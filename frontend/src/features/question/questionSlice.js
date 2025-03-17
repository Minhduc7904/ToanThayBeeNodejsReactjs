import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as questionApi from "../../services/questionApi";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";
import { setExam } from "../exam/examSlice";

export const fetchQuestions = createAsyncThunk(
    "questions/fetchQuestions",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.getAllQuestionAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, true, false);
    }
);

export const fetchExamQuestions = createAsyncThunk(
    "questions/fetchExamQuestions",
    async ({id, search, currentPage, limit, sortOrder }, {dispatch}) => {
        return await apiHandler(dispatch, questionApi.getExamQuestionsAPI, {id, search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
            dispatch(setExam(data.exam));
        }, true, false);
    }
);

export const fetchQuestionById = createAsyncThunk(
    "questions/fetchQuestionById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.getQuestionByIdAPI, id,  ()=>{}, true, false);
    }
);

export const postQuestion = createAsyncThunk(
    "questions/postQuestion",
    async ({ questionData, statementOptions, questionImage, solutionImage, statementImages, examId }, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.postQuestionAPI, { questionData, statementOptions, questionImage, solutionImage, statementImages, examId }, (data) => {
        }, true, false);
    }
    
);

export const putQuestion = createAsyncThunk(
    "questions/putQuestion",
    async ({ questionId, questionData, statements }, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.putQuestionAPI, { questionId, questionData, statements }, (data) => {
        }, true, false);
    }
);

export const putImageQuestion = createAsyncThunk(
    "questions/putImageQuestion",
    async ({ questionId, questionImage }, { dispatch }) => {
        const response = await apiHandler(dispatch, questionApi.putImageQuestionAPI, { questionId, questionImage }, (data) => {
        }, true, false);

        return response;
    }
);

export const putImageSolution = createAsyncThunk(
    "questions/putImageSolution",
    async ({ questionId, solutionImage }, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.putImageSolutionAPI, { questionId, solutionImage }, (data) => {
        }, true, false);
    }
);

export const putStatementImage = createAsyncThunk(
    "questions/putStatementImage",
    async ({ statementId, statementImage }, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.putStatementImageAPI, { statementId, statementImage }, (data) => {
        }, true, false);
    }
);

export const deleteQuestion = createAsyncThunk(
    "questions/deleteQuestion",
    async (questionId, { dispatch }) => {
        return await apiHandler(dispatch, questionApi.deleteQuestionAPI, questionId,()=>{}, true, false);
    }
);


const questionSlice = createSlice({
    name: "questions",
    initialState: {
        questions: [],
        question: null,
    },
    reducers: {
        resetDetailView: (state) => {
            state.question = null;
        },
        setDetailView: (state, action) => {
            state.isDetailView = true;
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.questions = [];
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                if (action.payload) {
                    state.questions = action.payload.data;
                }
            })
            .addCase(fetchExamQuestions.fulfilled, (state, action) => {
                if (action.payload) {
                    state.questions = action.payload.data;
                }
            })
            .addCase(fetchQuestionById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.question = action.payload.data;
                }
            })
    },
});

export const { setQuestion } = questionSlice.actions;
export default questionSlice.reducer;
