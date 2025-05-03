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

export const getClassPublicAPI = () => {
    return api.get(`/v1/user/class`);
}

export const getClassOverviewAPI = () => {
    return api.get(`/v1/user/class/overview`);
}

export const getClassByIdAPI = (id) => {
    return api.get(`/v1/admin/class/${id}`);
};

export const getClassByUserAPI = () => {
    return api.get("/v1/user/class/joined",);
};

export const getUncompletedLearningItemAPI = () => {
    return api.get(`/v1/user/learning-item/uncompleted`);
}

export const joinClassAPI = (classCode) => {
    return api.post(`/v1/user/class/${classCode}/join`);
}

export const getLessonLearningItemInClassAPI = (classCode) => {
    return api.get(`/v1/user/class/${classCode}/lesson/learning-item`);
}

export const getDataForLearningAPI = (classCode) => {
    return api.get(`/v1/user/class/${classCode}/learning`)
}

export const getFullLessonLearningItemByClassIdAPI = ({ classId }) => {
    return api.get(`/v1/admin/class/${classId}/lessons`);
}

export const postClassAPI = (data) => {
    return api.post("/v1/admin/class", data);
}

export const putClassAPI = ({data, id}) => {
    return api.put(`/v1/admin/class/${id}`, data);
}

export const acceptStudentClassAPI = ({classId, studentId}) => {
    return api.put(`/v1/admin/user/${studentId}/class/${classId}/accept`);
}

export const putSlideImagesForClassAPI = async ({ classId, slideId = null, images = [], keepImageIds = [] }) => {
    const formData = new FormData();

    formData.append("classId", classId);
    if (slideId) {
        formData.append("slideId", slideId);
    }

    if (keepImageIds.length > 0) {
        formData.append("keepImageIds", JSON.stringify(keepImageIds));
    }

    images.forEach((file) => {
        if (file !== null) {
            formData.append("images", file);
        }
    });

    const response = await api.put("/v1/admin/class/" + classId + "/images", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const uploadLearningItemPdfAPI = async ({ learningItemId, pdfFile }) => {
    const formData = new FormData();

    // Đảm bảo có file PDF
    // if (!pdfFile) {
    //     throw new Error("❌ Không có file PDF để upload.");
    // }

    formData.append("pdf", pdfFile);

    const response = await api.post(`/v1/admin/learning-item/${learningItemId}/upload-pdf`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const putLearningItemAPI = async ({ learningItemId, data }) => {
    const response = await api.put(`/v1/admin/learning-item/${learningItemId}`, data);
    return response.data;
}

export const putLessonAPI = async ({ lessonId, data }) => {
    const response = await api.put(`/v1/admin/lesson/${lessonId}`, data);
    return response.data;
}

export const postLessonAPI = async ({ data }) => {
    return await api.post(`/v1/admin/lesson`, data);
}

export const deleteLessonAPI = async ({ lessonId }) => {
    return await api.delete(`/v1/admin/lesson/${lessonId}`);
}

export const deleteLearningItemAPI = async ({ learningItemId }) => {
    return await api.delete(`/v1/admin/learning-item/${learningItemId}`);
}

export const markLearningItemAPI = async ({ learningItemId }) => {
    return await api.put(`v1/user/learning-item/${learningItemId}/mark`);
}

export const postLearningItemAPI = async ({ data }) => {
    return await api.post(`/v1/admin/learning-item`, data);
}

export const deleteClassAPI = async ({ classId }) => {
    return await api.delete(`/v1/admin/class/${classId}`);
}