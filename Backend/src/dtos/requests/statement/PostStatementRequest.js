import Joi from "joi"

class PostStatementRequest {
    constructor(data) {
        this.content = data.content
        this.isCorrect = data.isCorrect
        this.questionId = data.questionId
        this.difficulty = data.difficulty
        this.imageUrl = data.imageUrl
    }
    
    static validate(data) {
        const schema = Joi.object({
            content: Joi.string().required(),
            isCorrect: Joi.boolean().required(),
            questionId: Joi.number().required(),
            difficulty: Joi.string().optional(),
            imageUrl: Joi.string().uri().optional()
        })

        return schema.validate(data)
    }
}

export default PostStatementRequest
