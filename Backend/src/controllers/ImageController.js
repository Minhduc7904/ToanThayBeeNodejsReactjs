/**
- upload to loacal storage
- upload to google firebase
 */

import { get } from 'http';
import path from 'path';
import fs from 'fs';

export async function uploadImage(req, res) {
    if (req.files.length === 0) {
        throw new Error('Please select an image to upload');
    }
    const uploadImagesPaths = req.files.map(file => path.basename(file.path))

    return res.status(200).json({
        message: 'Upload image successfully',
        files: uploadImagesPaths
    });
}

export async function viewImage(req, res) {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../public/uploads', filename)
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.sendFile(imagePath);
    })
}
