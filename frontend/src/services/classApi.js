import api from "./api";

export const getAllClassesAPI = ({ search = "", currentPage = 1, limit = 10, sortOrder = 'desc' }) => {
    return api.get("/v1/admin/class", {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

export const getClassByIdAPI = (id) => {
    return api.get(`/v1/admin/class/${id}`);
};