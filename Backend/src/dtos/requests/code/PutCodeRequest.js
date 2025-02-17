import Joi from "joi";

class PutCodeRequest {
    constructor(data) {
        this.code = data.code;
        this.type = data.type;
        this.description = data.description;
    }
    
    static validate(data) {
        const schema = Joi.object({
            code: Joi.string().optional(),
            type: Joi.string().optional(),
            description: Joi.string().optional().allow(''),
        });

        return schema.validate(data);
    }
}

export default PutCodeRequest;
