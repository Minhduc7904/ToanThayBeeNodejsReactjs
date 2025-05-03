import Joi from "joi"

class PutUserRequest {
    constructor(data) {
        this.gender = data.gender
        this.birthDate = data.birthDate
        this.highSchool = data.highSchool
        this.class = data.class
    }

    static validate(data) {
        const schema = Joi.object({
            gender: Joi.boolean().optional(),
            birthDate: Joi.date().less("now").optional(),
            highSchool: Joi.string().max(100).optional(),
            class: Joi.string().max(50).optional(),
        })

        return schema.validate(data)
    }
}

export default PutUserRequest
