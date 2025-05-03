import api from "./api";

export const getArticleListAPI = async () => {
    return await api.get("/v1/user/article");
}

export const getNewestArticleAPI = async () => {
    return await api.get("/v1/user/article/newest");
}

export const getArticleAPI = async (id) => {
    return await api.get(`/v1/user/article/${id}`);
}

export const putArticleAPI = async ({ articleId, data }) => {
    return await api.put(`/v1/admin/article/${articleId}`, data);
}

export const postArticleAPI = async (data) => {
    return await api.post("/v1/admin/article", data);
}

export const deleteArticleAPI = async (id) => {
    return await api.delete(`/v1/admin/article/${id}`);
}