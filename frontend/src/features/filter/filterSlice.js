import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentPage: 1,  // Trang hiện tại
    totalPages: 1,   // Tổng số trang
    totalItems: 0,   // Tổng số mục
    limit: 10,       // Giới hạn số mục trên mỗi trang
    search: "",      // Chuỗi tìm kiếm
    sortOrder: "desc", // Sắp xếp tăng dần hoặc giảm dần
    isAddView: false,
    isFilterView: false,
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        // ✅ Cập nhật trang hiện tại
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // ✅ Cập nhật tổng số trang
        setTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },

        // ✅ Cập nhật tổng số mục
        setTotalItems: (state, action) => {
            state.totalItems = action.payload;
        },

        // ✅ Cập nhật giới hạn số mục trên mỗi trang
        setLimit: (state, action) => {
            state.limit = action.payload;
        },

        // ✅ Cập nhật giá trị tìm kiếm
        setSearch: (state, action) => {
            state.search = action.payload || ""; // ✅ Nếu không có giá trị, đặt thành ""
        },

        setSortOrder: (state) => {
            state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
        },

        setIsAddView: (state, action) => {
            state.isAddView = action.payload;   
        },

        setIsFilterView: (state, action) => {
            state.isFilterView = action.payload;
        },

        // ✅ Reset toàn bộ bộ lọc về trạng thái ban đầu
        resetFilters: () => initialState,
    },
});

export const { setCurrentPage, setTotalPages, setTotalItems, setLimit, setSearch, setSortOrder, setIsAddView, setIsFilterView, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
