import QRCode from "react-qr-code";

const QRCodeComponent = ({ url, size=150 }) => {

    return (
        <div className="flex items-center justify-center">
            <QRCode value={url} size={size} /> {/* size: Kích thước QR code */}
        </div>
    );
};

export default QRCodeComponent;
