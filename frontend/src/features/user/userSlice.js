import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsersAPI, getUserByIdAPI, putUserAPI } from "../../services/userApi";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, getAllUsersAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, false);
    }
);

export const fetchUserById = createAsyncThunk(
    "users/fetchUserById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, getUserByIdAPI, id,  ()=>{}, true, false);
    }
);

export const putUser = createAsyncThunk(
    "users/putUser",
    async ({id, user}, { dispatch }) => {
        return await apiHandler(dispatch, putUserAPI, {id, user}, ()=>{}, true);
    }
);


const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        student: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.student = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.users = [];
            })
            
            .addCase(fetchUsers.fulfilled, (state, action) => {
                if (action.payload) {
                    state.users = action.payload.data;
                }
            })
            .addCase(fetchUsers.rejected, () => {
                // Không cần xử lý gì vì lỗi đã được add vào stateApiSlice
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                if (action.payload) {
                    state.student = action.payload.user;
                }
            })
            .addCase(fetchUserById.rejected, () => {
                // Không cần xử lý gì vì lỗi đã được add vào stateApiSlice
            });
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
