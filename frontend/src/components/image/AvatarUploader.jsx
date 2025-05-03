import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setErrorMessage } from "../../features/state/stateApiSlice";
import DefaultAvatar from "../../assets/images/user.png";

const AvatarUploader = ({ avatarUrl, inputId, id, onImageChange }) => {
    const dispatch = useDispatch();
    const [preview, setPreview] = useState(null);
    const [image, setImage] = useState(null);
    const uploadRef = useRef(null);

    useEffect(() => {
        if (image) {
            setPreview(URL.createObjectURL(image));
            onImageChange(id, image);
        } else if (avatarUrl) {
            setPreview(avatarUrl);
        } else {
            setPreview(null);
        }
    }, [image, avatarUrl]);

    // Dán ảnh từ clipboard
    useEffect(() => {
        const handlePaste = (event) => {
            const items = event.clipboardData?.items;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.indexOf("image") !== -1) {
                        const file = item.getAsFile();
                        handleFile(file);
                    }
                }
            }
        };
        const node = uploadRef.current;
        node?.addEventListener("paste", handlePaste);
        return () => node?.removeEventListener("paste", handlePaste);
    }, []);

    const handleFile = (file) => {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            dispatch(setErrorMessage("Chỉ cho phép định dạng JPEG hoặc PNG!"));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            dispatch(setErrorMessage("Kích thước ảnh vượt quá 5MB!"));
            return;
        }
        setImage(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleUploadClick = () => {
        document.getElementById(inputId).click();
    };

    return (
        <div
            ref={uploadRef}
            className="relative w-28 h-28 rounded-full border-4 border-sky-500 overflow-hidden cursor-pointer group"
            onClick={handleUploadClick}
            tabIndex={0}
        >
            <img
                src={preview || DefaultAvatar}
                alt="avatar"
                className={`${preview ? '' : 'p-4' } w-full h-full object-cover`}
            />

            {/* Overlay hiển thị khi hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition duration-300 ease-in-out">
                <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100">
                    Tải ảnh lên
                </p>
            </div>

            {/* Input file ẩn */}
            <input
                id={inputId}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default AvatarUploader;
