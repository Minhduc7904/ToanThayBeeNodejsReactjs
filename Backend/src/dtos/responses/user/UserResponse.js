class responseUser {
    constructor(user, status=null) {
        this.id = user.id
        this.email = user.email
        this.lastName = user.lastName
        this.firstName = user.firstName
        this.userType = user.userType
        this.gender = user.gender
        this.birthDate = user.birthDate
        this.phone = user.phone
        this.highSchool = user.highSchool
        this.class = user.class
        this.status = user.status
        this.graduationYear = user.graduationYear
        this.highSchoolScore = user.highSchoolScore
        this.university = user.university
        this.studentClassStatus = status
    }
}

export default responseUser