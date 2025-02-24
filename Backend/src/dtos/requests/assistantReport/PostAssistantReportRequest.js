import Joi from "joi"

class PostAssistantReportRequest {
    constructor(data) {
        this.content = data.content
        this.assistantId = data.assistantId
        this.userId = data.userId
        this.star = data.star
    }
    
    static validate(data) {
        const schema = Joi.object({
            content: Joi.string().required(),
            assistantId: Joi.number().required(),
            userId: Joi.number().required(),
            star: Joi.number().required(),
        })

        return schema.validate(data)
    }
}

export default PostAssistantReportRequest
