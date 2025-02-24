import Joi from "joi"

class PostQuestionRequest {
    constructor(data) {
        this.class = data.class
        this.content = data.content
        this.typeOfQuestion = data.typeOfQuestion
        this.correctAnswer = data.correctAnswer
        this.difficulty = data.difficulty
        this.chapter = data.chapter
        this.description = data.description
        this.solutionUrl = data.solutionUrl
    }
    
    static validate(data) {
        const schema = Joi.object({
            class: Joi.string().required(),
            content: Joi.string().required(),
            typeOfQuestion: Joi.string().required(),
            correctAnswer: Joi.string().required(),
            difficulty: Joi.string().optional(),
            chapter: Joi.string().optional(),
            description: Joi.string().optional().allow(''),
            solutionUrl: Joi.string().uri().optional(),
        })

        return schema.validate(data)
    }
}

export default PostQuestionRequest
