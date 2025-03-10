import Joi from "joi";

class PostQuestionRequest {
    constructor(data) {
        let requestData = data;

        // Nếu là `form-data`, chuyển đổi sang JSON nếu có
        if (typeof data === "object" && data.questionData) {
            try {
                requestData = JSON.parse(data.questionData);
            } catch (error) {
                throw new Error("Dữ liệu gửi lên không đúng định dạng JSON");
            }
        }

        this.class = requestData.class;
        this.content = requestData.content;
        this.typeOfQuestion = requestData.typeOfQuestion;
        this.correctAnswer = requestData.correctAnswer;
        this.difficulty = requestData.difficulty;
        this.chapter = requestData.chapter;
        this.description = requestData.description;
        this.solutionUrl = requestData.solutionUrl;
    }

    static validate(data) {
        const schema = Joi.object({
            class: Joi.string().required(),
            content: Joi.string().required(),
            typeOfQuestion: Joi.string().required(),
            correctAnswer: Joi.string().optional(),
            difficulty: Joi.string().optional(),
            chapter: Joi.string().optional(),
            description: Joi.string().optional().allow(''),
            solutionUrl: Joi.string().uri().optional(),
        });

        return schema.validate(data);
    }
}

export default PostQuestionRequest;
