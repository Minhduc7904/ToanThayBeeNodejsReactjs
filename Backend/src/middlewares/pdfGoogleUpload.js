// middlewares/uploadPDF.js
import multer from 'multer'

// Chỉ cho phép PDF
const pdfFileFilter = (req, file, callback) => {
    if (file.mimetype === 'application/pdf') {
        callback(null, true)
    } else {
        callback(new Error('Only PDF files are allowed'), false)
    }
}

const uploadPDF = multer({
    storage: multer.memoryStorage(),
    fileFilter: pdfFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
})

export default uploadPDF
