import api from "./api";

export const getAllExamAPI = ({ search = "", currentPage = 1, limit = 10, sortOrder = 'asc' }) => {
    return api.get("/v1/admin/exam", {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

export const getExamByIdAPI = (id) => {
    return api.get(`/v1/admin/exam/${id}`);
}

export const putExamAPI = async ({examId, examData}) => {
    const response = await api.put(`/v1/admin/exam/${examId}`, examData);
    return response.data;
}

export const putImageExamAPI = async ({ examId, examImage }) => {
    const formData = new FormData();
    formData.append("examImage", examImage);
    const response = await api.put(`/v1/admin/exam/${examId}/image`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const postExamAPI = async ({ examData, examImage, questions, questionImages, statementImages }) => {
    const formData = new FormData();

    
    if (questions.length === 0) {
        formData.append("data", JSON.stringify({ examData }));
    } else {
        formData.append("data", JSON.stringify({ examData, questions }));
    }

    if (examImage) {
        formData.append("examImage", examImage);
    }

    if (questionImages && questionImages.length > 0) {
        questionImages.forEach((file) => {
            if (file !== null) formData.append("questionImages", file);
        });
    }

    if (statementImages && statementImages.length > 0) {
        statementImages.forEach((file) => {
            if (file !== null) formData.append("statementImages", file);
        });
    }

    const response = await api.post("/v1/admin/exam", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const deleteExamAPI = async (id) => {
    const response = await api.delete(`/v1/admin/exam/${id}`);
    return response.data;
}