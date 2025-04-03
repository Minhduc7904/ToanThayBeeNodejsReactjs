import { useState } from 'react';
import { ReactInternetSpeedMeter } from 'react-internet-meter';

function NetworkSpeedTest() {
    const [wifiSpeed, setWifiSpeed] = useState(null);

    const getWifiBars = (speed) => {
        if (speed === null) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray">
                    <circle cx="12" cy="18" r="2" />
                </svg>
            );
        }

        if (speed < 3) {
            // Tốc độ yếu - đỏ
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="red" />
                </svg>
            );
        }

        if (speed < 7) {
            // Tốc độ vừa - vàng
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17.6711 14.307C16.1841 12.819 14.1701 12 12.0001 12C9.8301 12 7.8161 12.819 6.3291 14.307L7.7431 15.721C8.8531 14.611 10.3641 13.999 12.0001 13.999C13.6361 14 15.1471 14.611 16.2571 15.721L17.6711 14.307Z" fill="orange" />
                    <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="orange" />
                </svg>
            );
        }

        // Tốc độ mạnh - xanh
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.6711 14.307C16.1841 12.819 14.1701 12 12.0001 12C9.8301 12 7.8161 12.819 6.3291 14.307L7.7431 15.721C8.8531 14.611 10.3641 13.999 12.0001 13.999C13.6361 14 15.1471 14.611 16.2571 15.721L17.6711 14.307Z" fill="green" />
                <path d="M20.437 11.2921C15.865 6.71905 8.13596 6.71905 3.56396 11.2921L4.97797 12.7061C8.78497 8.89906 15.216 8.89906 19.023 12.7061L20.437 11.2921Z" fill="green" />
                <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" fill="green" />
            </svg>
        );
    };

    return (
        <div className="flex items-center gap-2" title={wifiSpeed ? `${wifiSpeed} Mbps` : 'Đang đo tốc độ mạng...'}>
            <span>{getWifiBars(wifiSpeed)}</span>

            <ReactInternetSpeedMeter
                txtSubHeading=""
                outputType="text"
                customClassName="hidden"
                pingInterval={5000}
                thresholdUnit="megabyte"
                threshold={0.3}
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg"
                downloadSize="300000"
                callbackFunctionOnNetworkTest={(speed) => setWifiSpeed(speed)}
            />
        </div>
    );
}

export default NetworkSpeedTest;
