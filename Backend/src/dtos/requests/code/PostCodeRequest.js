import Joi from "joi";

class PostCodeRequest {
    constructor(data) {
        this.code = data.code;
        this.type = data.type;
        this.description = data.description;
    }
    
    static validate(data) {
        const schema = Joi.object({
            code: Joi.string().required(),
            type: Joi.string().required(),
            description: Joi.string().required().allow(''),
        });

        return schema.validate(data);
    }
}

export default PostCodeRequest;
