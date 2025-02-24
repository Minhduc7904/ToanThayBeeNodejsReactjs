import path from 'path'
import fs from 'fs'
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage'
import config from '../config/firebaseConfig'

/**
 * Upload image to Firebase Storage
 * @param {Object} req - Express request object
 * @returns {Object} - { file: downloadURL }
 */
export async function uploadImageToFirebase(req) {
    if (!req.file) {
        throw new Error('❌ No file provided. Please select an image to upload.')
    }

    try {
        const storage = getStorage()
        const newFileName = `${Date.now()}-${req.file.originalname}`
        const storageRef = ref(storage, `images/${newFileName}`)

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, {
            contentType: req.file.mimetype,
        })

        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log(`✅ File uploaded successfully: ${downloadURL}`)

        return { file: downloadURL.trim() }
    } catch (error) {
        console.error('❌ Error uploading to Firebase:', error)
        throw new Error('Failed to upload image.')
    }
}

/**
 * Get Firebase storage reference from URL
 * @param {Object} storage - Firebase storage instance
 * @param {string} url - File URL
 * @returns {Object} - Firebase file reference
 */
function getFileRefFromUrl(storage, url) {
    const decodedPath = decodeURIComponent(url.split('/o/')[1].split('?')[0])
    return ref(storage, decodedPath)
}

/**
 * Delete image from Firebase or local storage
 * @param {Object} req - Express request object
 * @returns {Object} - { success: boolean, message: string }
 */
export async function deleteImage(req) {
    let { url } = req.body

    if (!url || typeof url !== 'string') {
        return { success: false, message: '❌ Invalid URL provided.' }
    }

    url = url.trim()
    const storage = getStorage()

    try {
        if (url.startsWith('https://firebasestorage')) {
            const fileRef = getFileRefFromUrl(storage, url)
            await deleteObject(fileRef)
            console.log(`✅ Firebase image deleted: ${url}`)
            return { success: true, message: 'Image deleted from Firebase.' }
        } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const filePath = path.join(__dirname, '../public/uploads', path.basename(url))
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
                console.log(`✅ Local image deleted: ${filePath}`)
                return { success: true, message: 'Image deleted from local storage.' }
            }
            return { success: false, message: '❌ Local file not found.' }
        } else {
            return { success: false, message: '❌ Unsupported URL format.' }
        }
    } catch (error) {
        console.error('❌ Error deleting image:', error)
        return { success: false, message: 'Failed to delete image.' }
    }
}

export const uploadImage = async (file) => {
    if (!file) return null
    const { file: url } = await uploadImageToFirebase({ file })
    return url
}

export const cleanupUploadedFiles = async (files) => {
    await Promise.all(files.map(async (url) => {
        try {
            await deleteImage({ body: { url } })
            console.log(`✅ Đã xóa ảnh: ${url}`)
        } catch (err) {
            console.error(`❌ Lỗi khi xóa ảnh ${url}:`, err)
        }
    }))
}
