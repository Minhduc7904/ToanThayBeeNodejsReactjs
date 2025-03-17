import api from "./api";

export const getAllQuestionAPI = ({ search = "", currentPage = 1, limit = 10, sortOrder = 'asc' }) => {
    return api.get("/v1/admin/question", {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
};

export const deleteQuestionAPI = (questionId) => {
    return api.delete(`/v1/admin/question/${questionId}`);
}

export const getExamQuestionsAPI = ({id, search = "", currentPage = 1, limit = 10, sortOrder = 'asc' }) => {
    return api.get(`/v1/admin/exam/${id}/questions`, {
        params: {
            search,
            page: currentPage,
            limit,
            sortOrder,
        }
    });
}

export const getQuestionByIdAPI = (id) => {
    return api.get(`/v1/admin/question/${id}`);
};


export const postQuestionAPI = async ({ questionData, statementOptions, questionImage, solutionImage, statementImages, examId = null }) => {
    // Tạo đối tượng FormData để gửi dữ liệu dạng multipart/form-data
    const formData = new FormData();

    if (statementOptions.length === 0) {
        formData.append("data", JSON.stringify({ questionData, examId }));
    } else {
        formData.append("data", JSON.stringify({ questionData, statementOptions, examId }));
    }

    // Nếu có file ảnh cho câu hỏi, thêm vào formData
    if (questionImage) {
        formData.append("questionImage", questionImage);
    }

    if (solutionImage) {
        formData.append("solutionImage", solutionImage);
    }

    // Nếu có các file ảnh cho mệnh đề, thêm từng file vào formData
    if (statementImages && statementImages.length > 0) {
        statementImages.forEach((file) => {
            if (file !== null) formData.append("statementImages", file);
        });
    }

    // Gọi API POST với formData, thiết lập header "Content-Type" là multipart/form-data
    const response = await api.post("/v1/admin/question", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;

};

export const putImageQuestionAPI = async ({ questionId, questionImage }) => {
    const formData = new FormData();
    formData.append("questionImage", questionImage);
    const response = await api.put(`/v1/admin/question/${questionId}/image`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const putImageSolutionAPI = async ({ questionId, solutionImage }) => {
    const formData = new FormData();
    formData.append("solutionImage", solutionImage);
    const response = await api.put(`/v1/admin/question/${questionId}/solutionImage`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const putStatementImageAPI = async ({ statementId, statementImage }) => {
    const formData = new FormData();
    formData.append("statementImage", statementImage);
    const response = await api.put(`/v1/admin/statement/${statementId}/image`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const putQuestionAPI = async ({ questionId, questionData, statements }) => {
    const response = await api.put(`/v1/admin/question/${questionId}`, {
        questionData,
        statements,
    });

    return response.data;
};



