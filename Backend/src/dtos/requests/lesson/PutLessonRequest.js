import Joi from "joi"

class PutLessonRequest {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.day = data.day
        this.chapter = data.chapter
    }
    
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().min(1).max(255).optional(),
            description: Joi.string().min(1).max(4000).optional().allow('').allow(null),
            day: Joi.date().optional(),
            chapter: Joi.string().optional().allow(null),
        })

        return schema.validate(data)
    }
}

export default PutLessonRequest
