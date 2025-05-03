import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as achievementApi from "../../services/achievementApi";
import { setCurrentPage, setTotalPages, setTotalItems } from "../filter/filterSlice";
import { apiHandler } from "../../utils/apiHandler";

// Achievement Categories Thunks
export const fetchAchievementCategories = createAsyncThunk(
    "achievements/fetchAchievementCategories",
    async ({ search = "", currentPage = 1, limit = 10, sortOrder = 'asc' } = {}, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.getAllAchievementCategoriesAPI,
            { search, currentPage, limit, sortOrder },
            (data) => {
                dispatch(setCurrentPage(data.currentPage));
                dispatch(setTotalPages(data.totalPages));
                dispatch(setTotalItems(data.totalItems));
            },
            true, false
        );
    }
);

// Fetch achievement data for homepage
export const fetchAchievementDataForHomepage = createAsyncThunk(
    "achievements/fetchAchievementDataForHomepage",
    async (_) => {
        try {
            // Fetch all categories with no pagination
            const categoriesResponse = await achievementApi.getAllAchievementCategoriesAPI({ limit: 100 });
            const categories = categoriesResponse.data.data || [];

            // For each category, fetch its stats and images
            const categoriesWithData = await Promise.all(
                categories.map(async (category) => {
                    // Fetch stats for this category
                    const statsResponse = await achievementApi.getAllAchievementStatsAPI({
                        category_id: category.id,
                        limit: 100
                    });

                    // Fetch images for this category
                    const imagesResponse = await achievementApi.getAllAchievementImagesAPI({
                        category_id: category.id,
                        limit: 100
                    });

                    return {
                        ...category,
                        stats: statsResponse.data.data || [],
                        images: imagesResponse.data.data || []
                    };
                })
            );

            return categoriesWithData;
        } catch (error) {
            console.error("Error fetching achievement data for homepage:", error);
            throw error;
        }
    }
);

export const fetchAchievementCategoryById = createAsyncThunk(
    "achievements/fetchAchievementCategoryById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.getAchievementCategoryByIdAPI, id, () => {}, false, false);
    }
);

export const createAchievementCategory = createAsyncThunk(
    "achievements/createAchievementCategory",
    async (categoryData, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.createAchievementCategoryAPI, categoryData, () => {}, true, false);
    }
);

export const updateAchievementCategory = createAsyncThunk(
    "achievements/updateAchievementCategory",
    async ({ id, categoryData }, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.updateAchievementCategoryAPI, { id, categoryData }, () => {}, true, false);
    }
);

export const deleteAchievementCategory = createAsyncThunk(
    "achievements/deleteAchievementCategory",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.deleteAchievementCategoryAPI, id, () => {}, true, false);
    }
);

// Achievement Stats Thunks
export const fetchAchievementStats = createAsyncThunk(
    "achievements/fetchAchievementStats",
    async ({ search = "", currentPage = 1, limit = 10, sortOrder = 'asc' } = {}, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.getAllAchievementStatsAPI,
            { search, currentPage, limit, sortOrder },
            (data) => {
                dispatch(setCurrentPage(data.currentPage));
                dispatch(setTotalPages(data.totalPages));
                dispatch(setTotalItems(data.totalItems));
            },
            true, false
        );
    }
);

export const fetchAchievementStatById = createAsyncThunk(
    "achievements/fetchAchievementStatById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.getAchievementStatByIdAPI, id, () => {}, false, false);
    }
);

export const createAchievementStat = createAsyncThunk(
    "achievements/createAchievementStat",
    async (statData, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.createAchievementStatAPI, statData, () => {}, true, false);
    }
);

export const updateAchievementStat = createAsyncThunk(
    "achievements/updateAchievementStat",
    async ({ id, statData }, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.updateAchievementStatAPI, { id, statData }, () => {}, true, false);
    }
);

export const deleteAchievementStat = createAsyncThunk(
    "achievements/deleteAchievementStat",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.deleteAchievementStatAPI, id, () => {}, true, false);
    }
);

// Achievement Images Thunks
export const fetchAchievementImages = createAsyncThunk(
    "achievements/fetchAchievementImages",
    async ({ search = "", currentPage = 1, limit = 10, sortOrder = 'asc' } = {}, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.getAllAchievementImagesAPI,
            { search, currentPage, limit, sortOrder },
            (data) => {
                dispatch(setCurrentPage(data.currentPage));
                dispatch(setTotalPages(data.totalPages));
                dispatch(setTotalItems(data.totalItems));
            },
            true, false
        );
    }
);

export const fetchAchievementImageById = createAsyncThunk(
    "achievements/fetchAchievementImageById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.getAchievementImageByIdAPI, id, () => {}, false, false);
    }
);

export const createAchievementImage = createAsyncThunk(
    "achievements/createAchievementImage",
    async ({ imageData, image }, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.createAchievementImageAPI, { imageData, image }, () => {}, true, false);
    }
);

export const updateAchievementImage = createAsyncThunk(
    "achievements/updateAchievementImage",
    async ({ id, imageData, image }, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.updateAchievementImageAPI, { id, imageData, image }, () => {}, true, false);
    }
);

export const deleteAchievementImage = createAsyncThunk(
    "achievements/deleteAchievementImage",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, achievementApi.deleteAchievementImageAPI, id, () => {}, true, false);
    }
);

const achievementSlice = createSlice({
    name: "achievements",
    initialState: {
        categories: [],
        currentCategory: null,
        stats: [],
        currentStat: null,
        images: [],
        currentImage: null,
        loading: false,
        homepageData: [],
        homepageLoading: false
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setCurrentCategory: (state, action) => {
            state.currentCategory = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setCurrentStat: (state, action) => {
            state.currentStat = action.payload;
        },
        setImages: (state, action) => {
            state.images = action.payload;
        },
        setCurrentImage: (state, action) => {
            state.currentImage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Achievement Categories reducers
            .addCase(fetchAchievementCategories.pending, (state) => {
                state.loading = true;
                state.categories = [];
            })
            .addCase(fetchAchievementCategories.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data) {
                    state.categories = action.payload.data;
                }
            })
            .addCase(fetchAchievementCategoryById.pending, (state) => {
                state.loading = true;
                state.currentCategory = null;
            })
            .addCase(fetchAchievementCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data) {
                    state.currentCategory = action.payload.data;
                }
            })

            // Achievement Stats reducers
            .addCase(fetchAchievementStats.pending, (state) => {
                state.loading = true;
                state.stats = [];
            })
            .addCase(fetchAchievementStats.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data) {
                    state.stats = action.payload.data;
                }
            })
            .addCase(fetchAchievementStatById.pending, (state) => {
                state.loading = true;
                state.currentStat = null;
            })
            .addCase(fetchAchievementStatById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data) {
                    state.currentStat = action.payload.data;
                }
            })

            // Achievement Images reducers
            .addCase(fetchAchievementImages.pending, (state) => {
                state.loading = true;
                state.images = [];
            })
            .addCase(fetchAchievementImages.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data) {
                    state.images = action.payload.data;
                }
            })
            .addCase(fetchAchievementImageById.pending, (state) => {
                state.loading = true;
                state.currentImage = null;
            })
            .addCase(fetchAchievementImageById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.data) {
                    state.currentImage = action.payload.data;
                }
            })

            // Homepage achievement data reducers
            .addCase(fetchAchievementDataForHomepage.pending, (state) => {
                state.homepageLoading = true;
            })
            .addCase(fetchAchievementDataForHomepage.fulfilled, (state, action) => {
                state.homepageLoading = false;
                state.homepageData = action.payload;
            })
            .addCase(fetchAchievementDataForHomepage.rejected, (state) => {
                state.homepageLoading = false;
            });
    }
});

export const {
    setCategories,
    setCurrentCategory,
    setStats,
    setCurrentStat,
    setImages,
    setCurrentImage
} = achievementSlice.actions;

export default achievementSlice.reducer;
