import Joi from "joi";

class PutQuestionRequest {
    constructor(data) {
        this.class = data.class;
        this.content = data.content;
        this.typeOfQuestion = data.typeOfQuestion;
        this.correctAnswer = data.correctAnswer;
        this.difficulty = data.difficulty;
        this.chapter = data.chapter;
        this.description = data.description;
        this.solutionUrl = data.solutionUrl;
        this.imageUrl = data.imageUrl
    }
    
    static validate(data) {
        const schema = Joi.object({
            class: Joi.string().optional(),
            content: Joi.string().optional(),
            typeOfQuestion: Joi.string().optional(),
            correctAnswer: Joi.string().optional(),
            difficulty: Joi.string().optional(),
            chapter: Joi.string().optional(),
            description: Joi.string().optional().allow(''),
            solutionUrl: Joi.string().uri().optional(),
            imageUrl: Joi.string().uri().optional()
        });

        return schema.validate(data);
    }
}

export default PutQuestionRequest;
