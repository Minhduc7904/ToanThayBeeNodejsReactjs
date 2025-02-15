import Joi from "joi";

class PostCodeRequest {
    constructor(data) {
        this.code = code;
        this.kieu = kieu;
        this.mo_ta = mo_ta;
    }
    static validate(data) {
        const schema = Joi.object({
            code: Joi.string().required(),
            kieu: Joi.string().required(),
            mo_ta: Joi.string().required(),
        });

        return schema.validate(data);
    }
}

export default PostCodeRequest;