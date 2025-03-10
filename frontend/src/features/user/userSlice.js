import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsersAPI, getUserByIdAPI } from "../../services/userApi";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async ({ search, currentPage, limit, sortOrder }, { dispatch, rejectWithValue }) => {
        try {
            const response = await getAllUsersAPI({ search, currentPage, limit, sortOrder });
            dispatch(setCurrentPage(response.data.currentPage));
            dispatch(setTotalPages(response.data.totalPages));
            dispatch(setTotalItems(response.data.totalItems));

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "users/fetchUserById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await getUserByIdAPI(id);
            const userData = response.data.user;

            return userData;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false,
        error: null,
        user: null,
        isDetailView: localStorage.getItem("isDetailView") === "true",
        selectedUserId: localStorage.getItem("selectedUserId") || null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        resetDetailView: (state) => {
            state.isDetailView = false;
            state.user = null;
            state.selectedUserId = null;
            localStorage.removeItem("selectedUserId");
            localStorage.removeItem("isDetailView");
        },

        setDetailView: (state, action) => {
            state.isDetailView = true;
            state.selectedUserId = action.payload;
            localStorage.setItem("selectedUserId", action.payload);
            localStorage.setItem("isDetailView", "true");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Đã xảy ra lỗi không xác định";
            })
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isDetailView = true;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Đã xảy ra lỗi không xác định";
            });
    },
});

export const { setLoading, resetDetailView, setDetailView } = userSlice.actions;
export default userSlice.reducer;
