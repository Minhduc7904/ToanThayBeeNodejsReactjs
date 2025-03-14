import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addError } from "../../features/state/stateApiSlice";

const ImageUpload = ({ image, setImage, question = true, inputId, className='' }) => {
    const dispatch = useDispatch();
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false); // Trạng thái kéo thả

    // Xử lý khi chọn file qua input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                dispatch(addError(("Chỉ cho phép định dạng JPEG hoặc PNG!")));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                dispatch(addError(("Kích thước ảnh vượt quá 5MB!")));
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (image) {
            setPreview(URL.createObjectURL(image));
        }
    }, [image]);

    // Xử lý hiệu ứng khi kéo thả
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                dispatch(addError(("Chỉ cho phép định dạng JPEG hoặc PNG!")));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                dispatch(addError(("Kích thước ảnh vượt quá 5MB!")));
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Dùng inputId để trigger input file
    const handleUploadClick = () => {
        document.getElementById(inputId).click();
    };

    const handleDelete = () => {
        setImage(null);
        setPreview(null);
    };

    return (
        <div
            className={`flex ${className ? className : 'w-[15rem]'}  h-full flex-col ${question ? 'gap-[0.75rem] p-4' : 'flex-1'} justify-center items-center rounded-[1.625rem] border-2 border-dashed
            ${isDragging ? "border-blue-500 bg-blue-100" : "border-[#CDCFD0] bg-white"}
            transition-all duration-300 ease-in-out`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {!preview ? (
                <>
                    <div className="inline-flex flex-col justify-between items-center">
                        {question && (
                            <>
                                <div className="text-center text-[#202325] text-sm font-medium font-['Be Vietnam Pro'] leading-tight">
                                    Chọn ảnh từ máy của bạn
                                </div>
                                <div className="text-center text-[#979c9e] text-sm font-normal font-['Be Vietnam Pro'] leading-tight">
                                    Định dạng JPEG, PNG,... <br />
                                    tối đa 5MB
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="px-4 py-2 rounded-[48px] outline-1 outline-offset-[-1px] outline-[#cdcfd0] inline-flex justify-center items-center border border-[#cdcfd0] bg-[#f9f9f9] cursor-pointer hover:bg-[#f0f0f0]"
                    >
                        <div className="text-center text-[#404446] text-sm font-medium font-['Be Vietnam Pro'] leading-tight">
                            Tải ảnh lên
                        </div>
                    </button>
                    {/* Input file ẩn sử dụng inputId duy nhất */}
                    <input
                        id={inputId}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </>
            ) : (
                <div className="relative mt-2">
                    {question ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-32 object-contain rounded"
                        />
                    ) : (
                        <div className="text-center text-[#404446] text-sm font-medium font-['Be Vietnam Pro'] leading-tight">
                            {preview}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition duration-300 ease-in-out"
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
            )}
        </div>
    );
};

export default ImageUpload;
