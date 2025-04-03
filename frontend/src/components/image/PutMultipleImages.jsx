import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setErrorMessage } from "../../features/state/stateApiSlice";

const PutMultipleImages = ({ initialImages = [], putImageFunction, classId }) => {
    const dispatch = useDispatch();
    const [existingImages, setExistingImages] = useState([]); // { id, url }
    const [newImages, setNewImages] = useState([]); // { file, preview }
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (initialImages.length > 0) {
            setExistingImages(initialImages);
        }
    }, [initialImages]);

    const MAX_IMAGES = 5;

    const totalImages = () => existingImages.length + newImages.length;

    const handleFiles = (files) => {
        const newFiles = Array.from(files);

        if (totalImages() + newFiles.length > MAX_IMAGES) {
            dispatch(setErrorMessage(`Chỉ được tải tối đa ${MAX_IMAGES} ảnh.`));
            return;
        }

        const validFiles = [];

        for (let file of newFiles) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                dispatch(setErrorMessage("Chỉ cho phép định dạng JPEG hoặc PNG!"));
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                dispatch(setErrorMessage("Kích thước ảnh vượt quá 5MB!"));
                continue;
            }

            validFiles.push({
                file,
                preview: URL.createObjectURL(file)
            });
        }

        if (totalImages() + validFiles.length > MAX_IMAGES) {
            dispatch(setErrorMessage(`Bạn chỉ có thể thêm tối đa ${MAX_IMAGES - totalImages()} ảnh nữa.`));
            return;
        }

        setNewImages(prev => [...prev, ...validFiles]);
    };

    const handleFileChange = (event) => {
        handleFiles(event.target.files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (totalImages() >= MAX_IMAGES) {
            dispatch(setErrorMessage(`Chỉ được tải tối đa ${MAX_IMAGES} ảnh.`));
            return;
        }

        handleFiles(e.dataTransfer.files);
    };

    const handleDeleteExisting = (index) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    };

    const handleDeleteNew = (index) => {
        const updated = [...newImages];
        updated.splice(index, 1);
        setNewImages(updated);
    };

    const handleSave = () => {
        const keepImageIds = existingImages.map((img) => img.id);
        const images = newImages.map((img) => img.file);
        putImageFunction(images, keepImageIds, classId);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div
                className={`flex flex-wrap gap-4 border-2 border-dashed rounded-xl p-4 mb-4 
                    ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (totalImages() < MAX_IMAGES) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {existingImages.map((img, index) => (
                    <div key={`existing-${index}`} className="relative w-40 h-40">
                        <img src={img.url} alt={`image-${index}`} className="w-full h-full object-cover rounded-md" />
                        <button
                            onClick={() => handleDeleteExisting(index)}
                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-3-3v0a2 2 0 012 2h-4a2 2 0 012-2z"
                            />
                        </svg>
                        </button>
                    </div>
                ))}

                {newImages.map((img, index) => (
                    <div key={`new-${index}`} className="relative w-40 h-40">
                        <img src={img.preview} alt={`preview-${index}`} className="w-full h-full object-cover rounded-md" />
                        <button
                            onClick={() => handleDeleteNew(index)}
                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-3-3v0a2 2 0 012 2h-4a2 2 0 012-2z"
                            />
                        </svg>
                        </button>
                    </div>
                ))}

                {/* Nút thêm ảnh - ẩn nếu đã đủ ảnh */}
                {totalImages() < MAX_IMAGES && (
                    <label className="w-40 h-40 flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
                        <span className="text-gray-500 text-sm">Thêm ảnh</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            <div className="flex justify-end w-full items-center">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
                >
                    Lưu ảnh
                </button>
            </div>

        </div>
    );
};

export default PutMultipleImages;
