/**
- upload to loacal storage
- upload to google firebase
 */

import { get } from 'http';
import path from 'path';
import fs from 'fs';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import config from '../config/firebaseConfig';


export async function uploadImages(req, res) {
    console.log(req.files);
    if (!req.files) {
        throw new Error('Please select an image to upload');
    }
    const uploadImagesPaths = req.files.map(file => path.basename(file.path).trim())

    return res.status(200).json({
        message: 'Upload image successfully',
        files: uploadImagesPaths
    });
}

export async function uploadImage(req, res) {
    console.log(req.file);
    if (!req.file) {
        throw new Error('Please select an image to upload');
    }
    const uploadImagesPath = path.basename(req.file.path).trim();

    return res.status(200).json({
        message: 'Upload image successfully',
        file: uploadImagesPath
    });
}


export async function viewImage(req, res) {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../public/uploads', filename)
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Image not found' });
        }
        return res.sendFile(imagePath);
    })
}

export async function uploadImageToFirebase(req, res) {
    if (!req.file) {
        throw new Error('Please select an image to upload');
    }
    const storage = getStorage();
    const newFileName = `${Date.now()}-${req.file.originalname}`;   
    const storageRef = ref(storage, `images/${newFileName}`);
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
        contentType: req.file.mimetype,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File successfully uploaded to Firebase:');

    return res.status(201).json({
        message: 'Upload image successfully',
        file: downloadURL.trim()
    });
}

export async function uploadMultipleImagesToFirebase(req, res) {
    if (!req.files || req.files.length === 0) {
        throw new Error('Please select an image to upload');
    }
    const storage = getStorage();
    const uploadedFiles = await Promise.all(req.files.map(async (file) => {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const storageRef = ref(storage, `images/${newFileName}`);

        const snapshot = await uploadBytesResumable(storageRef, file.buffer, {
            contentType: file.mimetype,
        });

        const downloadURL = await getDownloadURL(snapshot.ref).trim();
        return downloadURL;
    }));

    console.log('All files uploaded successfully:', uploadedFiles);

    return res.status(201).json({
        message: "Upload multiple images successfully",
        files: uploadedFiles,
    });
}

export async function deleteImage(req, res) {
    console.log(req.body);
    const { url } = req.body;
    url = url.trim();
    try {
        if (!url) {
            return res.status(400).json({ error: "Image URL is required" });
        }
        const storage = getStorage();
        if (url.includes("https://firebasestorage")) {
            
            const fileRef = ref(storage, url);

            await deleteObject(fileRef);
            return res.status(200).json({ message: "Image deleted successfully" });
        } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const filePath = path.join(__dirname, '../public/uploads', path.basename(url));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(200).json({ message: "Image deleted successfully" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}