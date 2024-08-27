// app/qr-code/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const QRCodePage = () => {
    const router = useRouter();
    const [message, setMessage] = useState<string>('');
    const [data, setData] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const data = queryParams.get('data');
        if (data) {
            setData(data);
        }
    }, []);

    const handleConfirmReturn = async () => {
        setIsProcessing(true);
        try {
            const itemsArray = JSON.parse(decodeURIComponent(data));
            const formData = new FormData();
            formData.append('items', JSON.stringify(itemsArray));

            const response = await fetch('http://localhost:8000/return', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                setMessage('การยืนยันการคืนเสร็จสมบูรณ์');
            } else {
                throw new Error('ไม่สามารถยืนยันการคืนได้');
            }
        } catch (error: any) {
            setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {isProcessing ? (
                <p>กำลังดำเนินการ...</p>
            ) : (
                <>
                    <p>{message}</p>
                    <button 
                        onClick={handleConfirmReturn}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        ยืนยันการคืน
                    </button>
                </>
            )}
        </div>
    );
};

export default QRCodePage;
