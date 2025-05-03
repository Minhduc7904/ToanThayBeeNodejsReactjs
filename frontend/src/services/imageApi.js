import api from "./api";

export const getImagesAPI = async ({ folder }) => {
    return await api.get(`/v1/images/${folder}`);
}

export const getImagesFoldersAPI = async ({ folders }) => {
    return await api.post(`/v1/images/folders`, { folders });
}

export const postImageAPI = async ({ image, folder }) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("folder", folder);
    const response = await api.post("/v1/images/google/upload-single", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    // Add folder to the response data for use in the reducer
    if (response.data) {
        response.data.folder = folder;
    }

    return response;
}

export const deleteImageAPI = async ({ imageUrl }) => {
    // Extract folder from imageUrl if possible
    let folder = null;
    try {
        // Assuming imageUrl format contains folder name in the path
        // Example: https://storage.googleapis.com/toanthaybee/article/image.jpg
        const urlParts = imageUrl.split('/');
        // Get the second-to-last part which should be the folder name
        if (urlParts.length > 1) {
            folder = urlParts[urlParts.length - 2];
        }
    } catch (error) {
        console.error('Error extracting folder from URL:', error);
    }

    const response = await api.delete(`/v1/images/delete`, {
        data: { imageUrl },
    });

    // Add folder to the response data for use in the reducer
    if (response.data) {
        response.data.folder = folder;
    }

    return response;
};
