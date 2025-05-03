import api from "./api";

export const getAttemptsByExamIdApi = async ({ examId, currentPage }) => {
    const response = await api.get(`/v1/user/attempt/exam/${examId}`, {
        params: {
            page: currentPage,
        }
    });
    return response.data;
}

export const getAttemptByUser = async ({currentPage = 1}) => {
    return await api.get(`/v1/user/attempt`, {
        params: {
            page: currentPage,
        }
    });
}

export const getAttemptByStudentIdApi = async ({ examId }) => {
    return await api.get(`/v1/user/attempt/exam/${examId}/history`);
}

export const getAttemptByExamIdAdminApi = async ({examId, search = "", currentPage = 1, limit = 10 }) => {
    return api.get(`/v1/admin/attempt/exam/${examId}`, {
        params: {
            search,
            page: currentPage,
            limit,
        }
    });
};