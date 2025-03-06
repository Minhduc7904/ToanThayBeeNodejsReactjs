import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dropdownOpen: false,
    closeSidebar: false
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleDropdown: (state) => {
            state.dropdownOpen = !state.dropdownOpen;
        },
        toggleCloseSidebar: (state) => {
            state.closeSidebar = !state.closeSidebar;
        }
    }
})

export const { toggleDropdown, toggleCloseSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;