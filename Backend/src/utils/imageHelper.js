import path from "path";
import fs from "fs";

export const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }
    return `/uploads/${imageUrl}`;
};

export const checkLocalImageExists = (imageUrl) => {
    if (!imageUrl) return true;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return true;
    }
    const imagePath = path.join(__dirname, `../public/uploads/${imageUrl}`);
    return fs.existsSync(imagePath);
};
