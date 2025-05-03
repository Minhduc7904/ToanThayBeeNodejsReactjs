import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getImagesAPI, postImageAPI, deleteImageAPI, getImagesFoldersAPI } from "../../services/imageApi";
import { apiHandler } from "../../utils/apiHandler";

export const fetchImages = createAsyncThunk(
    "images/fetchImages",
    async (folder, { dispatch }) => {
        return await apiHandler(dispatch, getImagesAPI, { folder }, () => {
        }, true, false);
    }
);

export const fetchImagesFolders = createAsyncThunk(
    "images/fetchImagesFolders",
    async (folders, { dispatch }) => {
        return await apiHandler(dispatch, getImagesFoldersAPI, { folders }, () => {
        }, false, false);
    }
);


export const postImage = createAsyncThunk(
    "images/postImage",
    async ({ image, folder }, { dispatch }) => {
        return await apiHandler(dispatch, postImageAPI, { image, folder }, () => {
        }, true, false);
    }
);

export const deleteImage = createAsyncThunk(
    "images/deleteImage",
    async (imageUrl, { dispatch }) => {
        return await apiHandler(dispatch, deleteImageAPI, { imageUrl }, () => { }, true, false);
    }
);

const imageSlice = createSlice({
    name: "images",
    initialState: {
        images: {},
        imagesHome: [],
        imageUpload: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchImages.pending, (state) => {
                state.images = {};
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                if (action.payload) {
                    const folder = action.payload.folder
                    state.images[folder] = action.payload.images;
                }
            })
            .addCase(fetchImagesFolders.pending, (state) => {
                state.imagesHome = [];
            })
            .addCase(fetchImagesFolders.fulfilled, (state, action) => {
                if (action.payload) {
                    state.imagesHome = action.payload.images;
                }
            })
            .addCase(postImage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.imageUpload = action.payload.file;

                    // Check if the folder exists in state.images
                    const folder = action.payload.folder;
                    if (folder) {
                        // Initialize the folder array if it doesn't exist
                        if (!state.images[folder]) {
                            state.images[folder] = [];
                        }

                        // Add the file to the folder array
                        if (Array.isArray(state.images[folder])) {
                            state.images[folder].push(action.payload.file);
                        }
                    }
                }
            })
            .addCase(deleteImage.fulfilled, (state, action) => {
                const payload = action.payload;
                if (!payload) return;

                const { file: image, folder } = payload;

                if (folder && state.images[folder]) {
                    // Có folder: chỉ xoá trong folder đó
                    state.images[folder] = state.images[folder].filter(img => img !== image);
                } else {
                    // Không có folder: tìm và xoá ở mọi folder con
                    Object.keys(state.images).forEach(key => {
                        state.images[key] = state.images[key].filter(img => img !== image);
                    });
                }
            });

    },
});

export default imageSlice.reducer


