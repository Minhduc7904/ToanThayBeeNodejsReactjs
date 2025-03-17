import Joi from "joi"

class PutUserRequest {
    constructor(data) {
        this.lastName = data.lastName
        this.firstName = data.firstName
        this.gender = data.gender
        this.birthDate = data.birthDate
        this.phone = data.phone
        this.highSchool = data.highSchool
        this.class = data.class
        this.email = data.email
        this.graduationYear = data.graduationYear
        this.highSchoolScore = data.highSchoolScore
        this.university = data.university
        this.avatarUrl = data.avatarUrl
        this.status = data.status
        this.userType = data.userType
    }

    static validate(data) {
        const schema = Joi.object({
            lastName: Joi.string().max(50).optional(),
            firstName: Joi.string().max(50).optional(),
            gender: Joi.boolean().optional(),
            birthDate: Joi.date().less("now").optional(),
            phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
            highSchool: Joi.string().max(100).optional(),
            class: Joi.string().max(50).optional(),
            email: Joi.string().email().optional().allow(null),
            graduationYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
            highSchoolScore: Joi.number().min(0).max(10).optional(),
            university: Joi.string().max(100).optional().allow(''),
            avatarUrl: Joi.string().uri().optional(),
            status: Joi.string().required(),
            userType: Joi.string().required()
        })

        return schema.validate(data)
    }
}

export default PutUserRequest
