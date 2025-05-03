import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiHandler } from "../../utils/apiHandler";
import { getAnswersByAttemptAPI, getQuestionAndAnswersByAttemptAPI } from "../../services/answerApi";
import { setQuestions } from "../question/questionSlice";
import { setExam } from "../exam/examSlice";

export const fetchAnswersByAttempt = createAsyncThunk(
    "answers/fetchAnswersByAttempt",
    async (attemptId, { dispatch }) => {
        return await apiHandler(dispatch, getAnswersByAttemptAPI, { attemptId }, () => { }, true, false);
    }
);

export const fetchQuestionAndAnswersByAttempt = createAsyncThunk(
    "answers/fetchQuestionAndAnswersByAttempt",
    async ({ attemptId }, { dispatch }) => {
        return await apiHandler(dispatch, getQuestionAndAnswersByAttemptAPI, { attemptId }, (data) => {
            dispatch(setQuestions(data.data.questions));
            dispatch(setExam(data.data.exam));
        }, true, false);
    }
);

const answerSlice = createSlice({
    name: "answers",
    initialState: {
        answers: [],
        score: null,
    },
    reducers: {
        setAnswers: (state, action) => {
            const index = state.answers.findIndex(a => a.questionId === action.payload.questionId);
            if (index !== -1) {
                state.answers[index] = action.payload;
            } else {
                state.answers.push(action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnswersByAttempt.pending, (state) => {
                state.answers = [];
            })
            .addCase(fetchAnswersByAttempt.fulfilled, (state, action) => {
                if (action.payload) {
                    state.answers = action.payload.data;
                }
            })
            .addCase(fetchQuestionAndAnswersByAttempt.pending, (state) => {
                state.answers = [];
                state.score = null;
            })
            .addCase(fetchQuestionAndAnswersByAttempt.fulfilled, (state, action) => {
                if (action.payload) {
                    state.answers = action.payload.data.answers;
                    state.score = action.payload.data.score;
                }
            });
    },
});

export const { setAnswers } = answerSlice.actions;
export default answerSlice.reducer;
