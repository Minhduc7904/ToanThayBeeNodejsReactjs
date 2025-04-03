import React from "react";

const PdfViewer = ({ url, height = "600px", width = "100%" }) => {
    if (!url) {
        return <p>❌ Không có URL PDF để hiển thị.</p>;
    }

    return (
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
            <iframe
                src={url}
                title="PDF Viewer"
                width={width}
                height={height}
                style={{ border: "none" }}
            />
        </div>
    );
};

export default PdfViewer;
