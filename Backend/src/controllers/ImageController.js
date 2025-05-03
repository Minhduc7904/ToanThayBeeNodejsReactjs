import { uploadImage, cleanupUploadedFiles, getAllImagesFromFolder } from "../utils/imageUpload.js"

export async function getAllImages(req, res) {
    const folder = req.params.folder
    if (!folder || typeof folder !== 'string') {
        return res.status(400).json({ message: 'Folder name is required.' })
    }

    const images = await getAllImagesFromFolder(folder)
    return res.status(200).json({
        message: "Get all images successfully",
        images,
        folder,
    })
}

export async function getAllImagesFolders(req, res) {
    const folders = req.body.folders
    if (!folders || !Array.isArray(folders)) {
        return res.status(400).json({ message: 'Folders name is required.' })
    }

    const images = await Promise.all(folders.map(async (folder) => {
        return await getAllImagesFromFolder(folder)
    }))

    return res.status(200).json({
        message: "Get all images successfully",
        images,
    })
}


export async function uploadImageToFirebase(req, res) {
    const newImageFile = req.file
    const folder = req.body.folder
    if (!newImageFile) {
        throw new Error('Please select an image to upload')
    }

    let newImageUrl = await uploadImage(newImageFile, folder)

    if (!newImageUrl) {
        throw new Error('Upload image failed')
    }

    return res.status(201).json({
        message: "Upload image successfully",
        file: newImageUrl,
        folder,
    })
}

export async function deleteImage(req, res) {
    const { imageUrl } = req.body

    if (!imageUrl) {
        throw new Error('Please select an image to delete')
    }

    await cleanupUploadedFiles([imageUrl])

    return res.status(200).json({
        message: "Delete image successfully",
        file: imageUrl,
    })
}