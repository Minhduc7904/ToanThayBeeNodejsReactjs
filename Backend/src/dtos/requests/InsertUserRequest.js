import Joi from "joi";

class InsertUserRequest {
    constructor(data) {
        this.data = data;
    }

    validate() {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        return schema.validate(this.data);
    }
}