import path from 'path'
import fs from 'fs'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
    deleteObject
} from 'firebase/storage'
import config from '../config/firebaseConfig.js'

/**
 * Upload PDF file to Firebase Storage
 * @param {Object} req - Express request object
 * @returns {Object} - { file: downloadURL }
 */
export async function uploadPdfToFirebase(req) {
    if (!req.file) {
        throw new Error('❌ No file provided. Please select a PDF to upload.')
    }

    // Kiểm tra đúng định dạng PDF
    if (req.file.mimetype !== 'application/pdf') {
        throw new Error('❌ Invalid file type. Only PDF files are allowed.')
    }

    try {
        const storage = getStorage()
        const newFileName = `${Date.now()}-${req.file.originalname}`
        const storageRef = ref(storage, `pdfs/${newFileName}`) // Lưu trong thư mục 'pdfs/'

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
            contentType: req.file.mimetype,
        })

        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log(`✅ PDF uploaded successfully: ${downloadURL}`)

        return { file: downloadURL.trim() }
    } catch (error) {
        console.error('❌ Error uploading PDF to Firebase:', error)
        throw new Error('Failed to upload PDF.')
    }
}


/**
 * Delete a PDF file from Firebase Storage
 * @param {string} fileUrl - The full download URL of the file
 */
export async function deletePdfFromFirebase(fileUrl) {
    try {
        const storage = getStorage();

        // Lấy đường dẫn của file từ URL (ví dụ: "pdfs/1711462258314-filename.pdf")
        const decodedUrl = decodeURIComponent(fileUrl);
        const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
        const bucketName = config.storageBucket;
        const pathStart = `${baseUrl}${bucketName}/o/`;
        const filePathWithToken = decodedUrl.replace(pathStart, '').split('?')[0];
        const filePath = filePathWithToken.replace('%2F', '/'); // Đảm bảo có dấu "/"

        const fileRef = ref(storage, filePath);

        // Thử xóa file
        await deleteObject(fileRef);

        console.log('✅ PDF deleted successfully:', filePath);
        return { success: true };
    } catch (error) {
        // Kiểm tra lỗi có phải là lỗi không tìm thấy file
        if (error.code === 'storage/object-not-found') {
            console.warn('⚠️ PDF not found, no need to delete:', fileUrl);
            return { success: true };  // Không phải lỗi, vẫn coi là thành công
        }

        console.error('❌ Error deleting PDF from Firebase:', error);
        throw new Error('Failed to delete PDF.');
    }
}

