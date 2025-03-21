// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import usersReducer from '../features/user/userSlice';
import filterReducer from '../features/filter/filterSlice';
import questionReducer from '../features/question/questionSlice';
import codeReducer from '../features/code/codeSlice';
import stateReducer from '../features/state/stateApiSlice';
import examReducer from '../features/exam/examSlice';
import classReducer from '../features/class/classSlice';
import answerReducer from '../features/answer/answerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        users: usersReducer,
        filter: filterReducer,
        questions: questionReducer,
        codes: codeReducer,
        states: stateReducer,
        exams: examReducer,
        classes: classReducer,
        answers: answerReducer,
    },
});
