import path from 'path'
import multer from 'multer'
import config from '../config/firebaseConfig.js'


const fileFilter = (req, file, callback) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/heic', // Thêm định dạng HEIC từ iPhone
        'image/heif' // Thêm định dạng HEIF từ iPhone
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('File type is not supported'), false);
    }
};

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
