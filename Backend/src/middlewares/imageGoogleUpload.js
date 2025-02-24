import path from 'path'
import multer from 'multer'
import config from '../config/firebaseConfig'

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new Error('File type is not supported'), false)
    }
}

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

// upload.single('image')
// upload.array('images', 5)
export default upload