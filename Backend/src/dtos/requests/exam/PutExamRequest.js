import Joi from "joi"

class PutExamRequest {
    constructor(data) {
        this.name = data.name
        this.class = data.class
        this.typeOfExam = data.typeOfExam
        this.chapter = data.chapter
        this.year = data.year
        this.testDuration = data.testDuration
        this.description = data.description
        this.passRate = data.passRate
        this.solutionUrl = data.solutionUrl
        this.imageUrl = data.imageUrl
        this.public = data.public
    }

    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().optional(),
            class: Joi.string().optional(),
            typeOfExam: Joi.string().optional(),
            chapter: Joi.string().optional(),
            year: Joi.string().optional(),
            testDuration: Joi.number().integer().positive().optional(),
            description: Joi.string().optional().allow(''),
            passRate: Joi.number().integer().positive().optional(),
            solutionUrl: Joi.string().uri().optional(),
            imageUrl: Joi.string().uri().optional(),
            public: Joi.boolean().optional(),
        })

        return schema.validate(data)
    }
}

export default PutExamRequest
