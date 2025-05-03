import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSuccessMessage, setErrorMessage } from "../features/state/stateApiSlice";

const UploadPdfForm = ({ id, onSubmit }) => {
    const dispatch = useDispatch();
    const [pdfFile, setPdfFile] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    const handleFile = (file) => {
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
        } else {
            dispatch(setErrorMessage("❌ Vui lòng chọn một file PDF hợp lệ."));
        }
    };

    const handleFileChange = (e) => {
        handleFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Gọi hàm onSubmit từ prop và truyền vào dữ liệu cần thiết
        if (onSubmit) {
            await onSubmit({ id, pdfFile });
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: 16 }}>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("pdf-input").click()}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                    border: "2px dashed",
                    borderColor: isHovering ? "#1890ff" : "#999",
                    borderRadius: "8px",
                    padding: "30px",
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    backgroundColor: isHovering ? "#e6f7ff" : "#fafafa",
                    position: "relative",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                {pdfFile ? (
                    <>
                        <p style={{ margin: 0 }}>{pdfFile.name}</p>
                        {isHovering && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile();
                                }}
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    background: "#ff4d4f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    lineHeight: "24px",
                                    padding: 0
                                }}
                                title="Xóa file"
                            >
                                ×
                            </button>
                        )}
                    </>
                ) : (
                    <p>Kéo thả file PDF vào đây hoặc nhấn để chọn</p>
                )}
                <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-all"
                >
                    Upload
                </button>
            </div>
        </form>
    );
};

export default UploadPdfForm;
