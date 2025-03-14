import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsersAPI, getUserByIdAPI } from "../../services/userApi";
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
        return await apiHandler(dispatch, getUserByIdAPI, id);
    }
);


const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        user: null,
        isDetailView: false,
        selectedUserId: null,
    },
    reducers: {
        resetDetailView: (state) => {
            state.isDetailView = false;
            state.user = null;
            state.selectedUserId = null;
        },
        setDetailView: (state, action) => {
            state.isDetailView = true;
            state.selectedUserId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
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
                    state.user = action.payload.user;
                    state.isDetailView = true;
                }
            })
            .addCase(fetchUserById.rejected, () => {
                // Không cần xử lý gì vì lỗi đã được add vào stateApiSlice
            });
    },
});

export const { resetDetailView, setDetailView } = userSlice.actions;
export default userSlice.reducer;
