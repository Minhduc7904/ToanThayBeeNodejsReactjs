import Joi from "joi"

class PostLessonRequest {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.day = data.day
        this.classId = data.classId
        this.chapter = data.chapter
    }
    
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().min(1).max(255).required(),
            description: Joi.string().min(1).max(4000).optional().allow(''),
            day: Joi.date().required(),
            classId: Joi.number().integer().required(),
            chapter: Joi.string().optional().allow(null),
        })

        return schema.validate(data)
    }
}

export default PostLessonRequest
