import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";


// ✅ Cấu hình worker phù hợp với phiên bản 2.16.105
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const PdfScrollViewer = ({ fileUrl }) => {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="w-full flex flex-col items-center gap-6 py-4">
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                    <Page key={index} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
};

const TestPage = () => {
    const [fileUrl] = useState(
        "https://firebasestorage.googleapis.com/v0/b/toan-thay-bee-dc180.firebasestorage.app/o/pdfs%2F1744122199973-de-tham-khao-ky-thi-tot-nghiep-thpt-tu-nam-2025-mon-toan.pdf?alt=media&token=f9c29b7f-5d46-4ed1-997d-1e77cb5ac204"
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">PDF Viewer</h1>
            <PdfScrollViewer fileUrl={fileUrl} />
        </div>
    );
};

export default TestPage;

