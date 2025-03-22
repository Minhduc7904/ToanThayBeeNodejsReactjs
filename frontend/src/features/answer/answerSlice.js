import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiHandler } from "../../utils/apiHandler";
import { getAnswersByAttemptAPI } from "../../services/answerApi";

export const fetchAnswersByAttempt = createAsyncThunk(
    "answers/fetchAnswersByAttempt",
    async (attemptId, { dispatch }) => {
        return await apiHandler(dispatch, getAnswersByAttemptAPI, { attemptId }, () => { }, true, false);
    }
);


const answerSlice = createSlice({
    name: "answers",
    initialState: {
        answers: [],

    },
    reducers: {
        setAnswers: (state, action) => {
            state.answers = action.payload;
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
    },
});

export const { setAnswers } = answerSlice.actions;
export default answerSlice.reducer;
