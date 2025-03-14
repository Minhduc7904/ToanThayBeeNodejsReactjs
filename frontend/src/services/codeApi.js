import api from './api';

export const getCodeByTypeAPI = (types) => {
    const formattedTypes = Array.isArray(types) ? types : [types];

    return api.get('/v1/admin/code/type', {
        params: {
            types: formattedTypes
        }
    });
};
