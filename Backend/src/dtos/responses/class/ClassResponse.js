class responseClass {
    constructor(lop, status=null) {
        this.id = lop.id
        this.name = lop.name
        this.description = lop.description
        this.academicYear = lop.academicYear
        this.status = lop.status
        this.slideId = lop.slideId
        this.lessonCount = lop.lessonCount
        this.dayOfWeek = lop.dayOfWeek
        this.studyTime = lop.studyTime
        this.studentClassStatus = status
        this.public = lop.public
    }
}

export default responseClass