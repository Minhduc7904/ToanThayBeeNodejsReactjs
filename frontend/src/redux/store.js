// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import usersReducer from '../features/user/userSlice';
import filterReducer from '../features/filter/filterSlice';
import questionReducer from '../features/question/questionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        users: usersReducer,
        filter: filterReducer,
        questions: questionReducer,
    },
});
