import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';


interface QRCodeScannerProps {
    onScanSuccess: (decodedText: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const qrCodeScannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isScanning && qrCodeScannerRef.current) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: 250 },
                false
            );

            scanner.render(onScanSuccess, (errorMessage: string) => {
                console.error('QR Code scan error:', errorMessage);
            });

            return () => {
                scanner.clear();
            };
        }
    }, [isScanning, onScanSuccess]);

    return (
        <div>
            <button
                onClick={() => setIsScanning(true)}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Start QR Code Scan
            </button>
            <div id="qr-reader" ref={qrCodeScannerRef} className="mt-4"></div>
        </div>
    );
};

export default QRCodeScanner;
