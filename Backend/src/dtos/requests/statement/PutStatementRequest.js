import Joi from "joi";

class PutStatementRequest {
    constructor(data) {
        this.content = data.content;
        this.isCorrect = data.isCorrect;
        this.questionId = data.questionId;
        this.difficulty = data.difficulty;
        this.imageUrl = data.imageUrl;
    }
    
    static validate(data) {
        const schema = Joi.object({
            content: Joi.string().optional(),
            isCorrect: Joi.boolean().optional(),
            questionId: Joi.number().optional(),
            difficulty: Joi.string().optional(),
            imageUrl: Joi.string().uri().optional()
        });

        return schema.validate(data);
    }
}

export default PutStatementRequest;
