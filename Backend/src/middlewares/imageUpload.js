import path from 'path'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destinationPath = path.join(__dirname, '../public/uploads')
        callback(null, destinationPath)
    },
    filename: (req, file, callback) => {
        const newFileName = `${Date.now()}-${file.originalname}`
        callback(null, newFileName)
    }
})

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(new Error('File type is not supported'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

export default upload