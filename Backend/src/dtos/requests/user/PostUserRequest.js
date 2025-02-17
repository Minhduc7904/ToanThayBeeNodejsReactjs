import Joi from "joi";
import bcrypt from "bcrypt";

class PostUserRequest {
    constructor(data) {
        this.middleName = data.middleName;
        this.lastName = data.lastName;
        this.firstName = data.firstName;
        this.username = data.username;
        this.password = data.password
        this.userType = data.userType;
        this.gender = data.gender;
        this.birthDate = data.birthDate;
        this.phone = data.phone;
        this.highSchool = data.highSchool;
        this.class = data.class;
        this.email = data.email;
        this.status = data.status;
        this.graduationYear = data.graduationYear;
        this.highSchoolScore = data.highSchoolScore;
        this.university = data.university;
        this.avatarUrl = data.avatarUrl;
    }

    static validate(data) {
        const schema = Joi.object({
            middleName: Joi.string().max(50).optional(),
            lastName: Joi.string().max(50).required(),
            firstName: Joi.string().max(50).required(),
            username: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(6).max(50).required(),
            userType: Joi.string().required(),
            gender: Joi.boolean().required(),
            birthDate: Joi.date().less("now").required(),
            phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
            highSchool: Joi.string().max(100).optional(),
            class: Joi.string().max(50).optional(),
            email: Joi.string().email().required(),
            status: Joi.string().required(),
            graduationYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
            highSchoolScore: Joi.number().min(0).max(10).optional(),
            university: Joi.string().max(100).optional().allow(''),
            avatarUrl: Joi.string().uri().optional(),
        });

        return schema.validate(data);
    }
}

export default PostUserRequest;
