import Joi from "joi"

class PostLessonRequest {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.day = data.day
        this.classId = data.classId
    }
    
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().min(1).max(255).required(),
            description: Joi.string().min(1).max(4000).optional(),
            day: Joi.date().required(),
            classId: Joi.number().integer().required()
        })

        return schema.validate(data)
    }
}

export default PostLessonRequest
