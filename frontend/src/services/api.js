import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

export const postQuestion = async (questionData, answerOptions) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/question`, { questionData, answerOptions })
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : new Error("Lỗi không xác định")
    }
}
