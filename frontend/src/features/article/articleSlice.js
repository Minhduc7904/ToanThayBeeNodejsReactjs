import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as articleApi from "../../services/articleApi";
import { apiHandler } from "../../utils/apiHandler";

export const fetchArticles = createAsyncThunk(
    "articles/fetchArticles",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, articleApi.getArticleListAPI, null, () => {
        }, false, false);
    }
);

export const fetchNewestArticle = createAsyncThunk(
    "articles/fetchNewestArticle",
    async (_, { dispatch }) => {
        return await apiHandler(dispatch, articleApi.getNewestArticleAPI, null, () => {
        }, false, false);
    }
);

export const fetchArticleById = createAsyncThunk(
    "articles/fetchArticleById",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, articleApi.getArticleAPI, id, () => {
        }, false, false);
    }
);

export const postArticle = createAsyncThunk(
    "articles/postArticle",
    async (data, { dispatch }) => {
        return await apiHandler(dispatch, articleApi.postArticleAPI, data, () => {
        }, true, false);
    }
);

export const putArticle = createAsyncThunk(
    "articles/putArticle",
    async ({ articleId, data }, { dispatch }) => {
        return await apiHandler(dispatch, articleApi.putArticleAPI, { articleId, data }, () => {
        }, true, false);
    }
);

export const deleteArticle = createAsyncThunk(
    "articles/deleteArticle",
    async (id, { dispatch }) => {
        return await apiHandler(dispatch, articleApi.deleteArticleAPI, id, () => {
        }, true, false);
    }
);

const articleSlice = createSlice({
    name: "articles",
    initialState: {
        articles: [],
        article: null,
    },
    reducers: {
        setArticles: (state, action) => {
            state.articles = action.payload;
        },
        setArticle: (state, action) => {
            state.article = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticles.pending, (state) => {
                state.articles = [];
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.articles = action.payload.data;
            })
            .addCase(fetchNewestArticle.pending, (state) => {
                state.articles = [];
            })
            .addCase(fetchNewestArticle.fulfilled, (state, action) => {
                state.articles = action.payload.data;
            })
            .addCase(fetchArticleById.pending, (state) => {
                state.article = null;
            })
            .addCase(fetchArticleById.fulfilled, (state, action) => {
                state.article = action.payload.data;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                console.log(action.payload)
                state.articles = state.articles.filter((article) => article.id != action.payload.data);
            })
    },
});

export const { setArticles } = articleSlice.actions;
export default articleSlice.reducer;