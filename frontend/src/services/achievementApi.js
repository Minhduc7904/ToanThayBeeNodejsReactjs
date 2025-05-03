import api from "./api";

// Achievement Categories API
export const getAllAchievementCategoriesAPI = ({ search = "", currentPage = 1, limit = 10, sortOrder = 'ASC', sortBy = 'display_order' } = {}) => {
    return api.get("/v1/achievement/categories", {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
            sortBy
        }
    });
};

export const getAchievementCategoryByIdAPI = (id) => {
    return api.get(`/v1/achievement/categories/${id}`);
};

export const createAchievementCategoryAPI = (categoryData) => {
    // The controller expects id, label, title, description, display_order
    // and optionally stats and images arrays

    // Ensure line breaks are preserved in description
    const processedData = {
        ...categoryData,
        description: categoryData.description.replace(/\n/g, '\\n')
    };

    return api.post("/v1/admin/achievement/categories", processedData);
};

export const updateAchievementCategoryAPI = ({ id, categoryData }) => {
    // The controller expects label, title, description, display_order

    // Ensure line breaks are preserved in description
    const processedData = {
        ...categoryData,
        description: categoryData.description.replace(/\n/g, '\\n')
    };

    return api.put(`/v1/admin/achievement/categories/${id}`, processedData);
};

export const deleteAchievementCategoryAPI = (id) => {
    return api.delete(`/v1/admin/achievement/categories/${id}`);
};

// Achievement Stats API
export const getAllAchievementStatsAPI = ({ category_id = "", currentPage = 1, limit = 10, sortOrder = 'ASC' } = {}) => {
    return api.get("/v1/achievement/stats", {
        params: {
            category_id,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

export const getAchievementStatByIdAPI = (id) => {
    return api.get(`/v1/achievement/stats/${id}`);
};

export const createAchievementStatAPI = (statData) => {
    // The controller expects category_id, value, label, display_order
    return api.post("/v1/admin/achievement/stats", statData);
};

export const updateAchievementStatAPI = ({ id, statData }) => {
    // The controller expects value, label, display_order
    return api.put(`/v1/admin/achievement/stats/${id}`, statData);
};

export const deleteAchievementStatAPI = (id) => {
    return api.delete(`/v1/admin/achievement/stats/${id}`);
};

// Achievement Images API
export const getAllAchievementImagesAPI = ({ category_id = "", currentPage = 1, limit = 10, sortOrder = 'ASC' } = {}) => {
    return api.get("/v1/achievement/images", {
        params: {
            category_id,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

export const getAchievementImageByIdAPI = (id) => {
    return api.get(`/v1/achievement/images/${id}`);
};

export const createAchievementImageAPI = async ({ imageData, image }) => {
    const formData = new FormData();

    // Add individual fields from imageData
    formData.append("category_id", imageData.category_id);

    // Ensure line breaks are preserved in caption
    const processedCaption = imageData.caption ? imageData.caption.replace(/\n/g, '\\n') : "";
    formData.append("caption", processedCaption);

    formData.append("display_order", imageData.display_order);
    formData.append("is_featured", imageData.is_featured ? "true" : "false");

    // Add the image file
    if (image) {
        formData.append("image", image);
    }

    const response = await api.post("/v1/admin/achievement/images", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateAchievementImageAPI = async ({ id, imageData, image }) => {
    const formData = new FormData();

    // Add individual fields from imageData

    // Ensure line breaks are preserved in caption
    const processedCaption = imageData.caption ? imageData.caption.replace(/\n/g, '\\n') : "";
    formData.append("caption", processedCaption);

    formData.append("display_order", imageData.display_order);
    formData.append("is_featured", imageData.is_featured ? "true" : "false");

    // Add the image file if provided
    if (image) {
        formData.append("image", image);
    }

    const response = await api.put(`/v1/admin/achievement/images/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const deleteAchievementImageAPI = (id) => {
    return api.delete(`/v1/admin/achievement/images/${id}`);
};
