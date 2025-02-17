class responseUser {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.middleName = user.middleName;
        this.lastName = user.lastName;
        this.userType = user.userType;
        this.gender = user.gender;
        this.birthDate = user.birthDate;
        this.phone = user.phone;
        this.highSchool = user.highSchool;
        this.class = user.class;
        this.status = user.status;
        this.graduationYear = user.graduationYear;
        this.highSchoolScore = user.highSchoolScore;
        this.university = user.university;
    }
}

export default responseUser;