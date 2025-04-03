import Joi from "joi"

class PostClassRequest {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.academicYear = data.academicYear
        this.status = data.status
        this.slideId = data.slideId
        this.dayOfWeek = data.dayOfWeek
        this.studyTime = data.studyTime
        this.public = data.public
    }
    
    static validate(data) {
        console.log(data)
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().optional().allow(''),
            academicYear: Joi.string().required(),
            status: Joi.string().required(),
            slideId: Joi.number().optional(),
            dayOfWeek: Joi.string().optional(),
            studyTime: Joi.string().optional(),
            public: Joi.boolean().optional(),
        })

        return schema.validate(data)
    }
}

export default PostClassRequest
