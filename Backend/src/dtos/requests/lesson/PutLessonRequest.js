import Joi from "joi";

class PutLessonRequest {
    constructor(data) {
        this.name = data.name;
        this.description = data.description;
        this.day = data.day;
    }
    
    static validate(data) {
        const schema = Joi.object({
            name: Joi.string().min(1).max(255).optional(),
            description: Joi.string().min(1).max(4000).optional(),
            day: Joi.date().optional()
        });

        return schema.validate(data);
    }
}

export default PutLessonRequest;
