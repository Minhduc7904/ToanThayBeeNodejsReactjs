import Joi from "joi"

class PutClassRequest {
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
        const schema = Joi.object({
            name: Joi.string().optional(),
            description: Joi.string().optional(),
            academicYear: Joi.string().optional(),
            status: Joi.string().optional(),
            slideId: Joi.number().optional(),
            dayOfWeek: Joi.string().optional(),
            studyTime: Joi.string().optional(),
            public: Joi.boolean().optional(),
        })

        return schema.validate(data)
    }
}

export default PutClassRequest
