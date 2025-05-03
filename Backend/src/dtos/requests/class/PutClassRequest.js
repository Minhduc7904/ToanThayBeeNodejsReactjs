import Joi from "joi"

class PutClassRequest {
    constructor(data) {
        this.name = data.name
        this.description = data.description
        this.academicYear = data.academicYear
        this.status = data.status
        this.dayOfWeek = data.dayOfWeek
        this.studyTime = data.studyTime
        this.public = data.public
        this.dow = data.dow
    }
    
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().optional(),
            description: Joi.string().optional().allow(''),
            academicYear: Joi.string().optional(),
            status: Joi.string().optional(),
            dayOfWeek: Joi.string().optional(),
            studyTime: Joi.string().optional(),
            public: Joi.boolean().optional(),
            dow: Joi.string().optional(),
        })

        return schema.validate(data)
    }
}

export default PutClassRequest
