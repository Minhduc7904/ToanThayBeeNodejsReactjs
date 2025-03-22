import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllClassesAPI, getClassByIdAPI } from "../../services/classApi";
import { setCurrentPage, setTotalItems, setTotalPages } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";

export const fetchClasses = createAsyncThunk(
    "classes/fetchClasses",
    async ({ search, currentPage, limit, sortOrder }, { dispatch }) => {
        return await apiHandler(dispatch, getAllClassesAPI, { search, currentPage, limit, sortOrder }, (data) => {
            dispatch(setCurrentPage(data.currentPage));
            dispatch(setTotalPages(data.totalPages));
            dispatch(setTotalItems(data.totalItems));
        }, true, false);
    }
);

export const fetchClassById = createAsyncThunk(
    "classes/fetchClassById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, getClassByIdAPI, id,  ()=>{}, true, false);
    }
);

const classSlice = createSlice({
    name: "classes",
    initialState: {
        classes: [],
        classDetail: null,
    },
    reducers: {
        setClass: (state, action) => {
            state.classDetail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClasses.pending, (state) => {
                state.classes = [];
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.classes = action.payload.data;
            })
            .addCase(fetchClassById.pending, (state) => {
                state.classDetail = null;
            })
            .addCase(fetchClassById.fulfilled, (state, action) => {
                state.classDetail = action.payload.data;
            })
    },
});

export const { setClass } = classSlice.actions;
export default classSlice.reducer;