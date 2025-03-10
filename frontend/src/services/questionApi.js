import api from "./api";

export const getAllQuestionAPI = ({ search = "", currentPage = 1, limit = 10, sortOrder = 'desc' }) => {
    return api.get("/v1/admin/question", {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

