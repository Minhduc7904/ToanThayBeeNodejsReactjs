import Joi from "joi"

class LoginUserRequest {
    constructor(data) {
        this.username = data.username
        this.password = data.password
        this.email = data.email
    }

    static validate(data) {
        const schema = Joi.object({
            email: Joi.string().email().optional().allow(''),
            username: Joi.string().min(3).max(30).optional().allow(''),
            password: Joi.string().min(6).max(50).optional().allow(''),
        })

        return schema.validate(data)
    }
}

export default LoginUserRequest
