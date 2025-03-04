import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dropdownOpen: false,
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleDropdown: (state) => {
            state.dropdownOpen = !state.dropdownOpen;
        }
    }
})

export const { toggleDropdown } = sidebarSlice.actions;
export default sidebarSlice.reducer;