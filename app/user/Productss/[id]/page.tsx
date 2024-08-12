'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: string;
    device_approve: boolean;
    device_limit: number;
}

const ProductPage: React.FC = () => {
    const [device, setDevice] = useState<Device | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const deviceId = searchParams.get('id');

    useEffect(() => {
        if (deviceId) {
            fetchDeviceDetails(deviceId);
        }
    }, [deviceId]);

    const fetchDeviceDetails = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8000/devices/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setDevice(data);
        } catch (error) {
            console.error('Error fetching device details:', error);
        }
    };

    const handleRequestBorrow = async () => {
        if (device) {
            // Implement the borrow request functionality here
            console.log('Request to borrow device:', device.device_id);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">รายละเอียดอุปกรณ์</h1>

            {device ? (
                <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg bg-white">
                    <h2 className="text-xl font-semibold mb-2">{device.device_name}</h2>
                    <p className="text-gray-700 mb-2"><strong>คำอธิบาย:</strong> {device.device_description}</p>
                    <p className="text-gray-700 mb-2"><strong>สถานะอุปกรณ์:</strong> {device.device_approve ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}</p>
                    <p className="text-gray-700 mb-4"><strong>จำนวนอุปกรณ์:</strong> {device.device_limit}</p>

                    {device.device_approve ? (
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            onClick={handleRequestBorrow}
                        >
                            ขออนุญาตยืม
                        </button>
                    ) : (
                        <p className="text-red-600">ไม่สามารถขอยืมอุปกรณ์นี้ได้</p>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-600">กำลังโหลดข้อมูล...</p>
            )}
        </div>
    );
};

export default ProductPage;
