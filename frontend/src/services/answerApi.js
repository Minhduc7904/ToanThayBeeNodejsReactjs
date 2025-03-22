import api from "./api";

export const getAnswersByAttemptAPI = ({ attemptId }) => {
    return api.get(`/v1/user/answer/attempt/${attemptId}`);
}