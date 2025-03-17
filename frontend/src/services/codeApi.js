import api from './api';

export const getCodeByTypeAPI = (types) => {
    const formattedTypes = Array.isArray(types) ? types : [types];

    return api.get('/v1/admin/code/type', {
        params: {
            types: formattedTypes
        }
    });
};

export const getAllCodesAPI = ({ search = "", currentPage = 1, limit = 10, sortOrder = 'asc' }) => {
    return api.get("/v1/admin/code", {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

export const createCodeAPI = (code) => {
    return api.post('/v1/admin/code', code);
};

export const putCodeAPI = async ({ code, codeData }) => {
    const response = await api.put(`/v1/admin/code/${code}`,
        codeData
    );

    return response.data;
};

