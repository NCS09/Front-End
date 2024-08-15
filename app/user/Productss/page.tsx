'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: string;
    device_approve: boolean;
}

const CartPage: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevices, setSelectedDevices] = useState<{ [key: string]: number }>({});
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const deviceIds = searchParams.getAll('device_id');
        const quantities = searchParams.getAll('quantity');
        const deviceSelections: { [key: string]: number } = {};
        
        deviceIds.forEach((deviceId, index) => {
            deviceSelections[deviceId] = parseInt(quantities[index], 10);
        });

        setSelectedDevices(deviceSelections);
        fetchDevices(deviceIds);
    }, [searchParams]);

    const fetchDevices = async (deviceIds: string[]) => {
        try {
            const response = await fetch("http://localhost:8000/devices", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ device_ids: deviceIds }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleSubmitRequest = async () => {
        const selectedItems = Object.keys(selectedDevices).filter(deviceId => selectedDevices[deviceId] > 0);
        
        if (selectedItems.length > 0) {
            try {
                const response = await fetch('http://localhost:8000/loan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        item_ids: selectedItems,
                        loan_status: 'pending', // เปลี่ยนได้ตามการใช้งานจริง
                        due_date: new Date().toISOString(), // กำหนดวันครบกำหนด
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit request');
                }

                const result = await response.json();
                alert(result.message || 'Request submitted successfully');
                router.push('/user/homepage'); // Redirect หลังการส่งคำร้องสำเร็จ
            } catch (error) {
                console.error('Error submitting request:', error);
                alert('Failed to submit request');
            }
        } else {
            alert("กรุณาเลือกจำนวนอุปกรณ์ที่ต้องการยืมก่อนส่งคำร้อง");
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">รถเข็นของคุณ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.length === 0 ? (
                    <p className="text-center text-gray-600">รถเข็นของคุณว่างเปล่า</p>
                ) : (
                    devices.map(device => (
                        <div key={device.device_id} className="flex flex-col p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
                            <h2 className="text-xl font-semibold mb-2 text-purple-600">{device.device_name}</h2>
                            <p className="text-gray-700 mb-2"><strong>คำอธิบาย:</strong> {device.device_description}</p>
                            <p className="text-gray-700 mb-2"><strong>สถานะ:</strong> {device.device_approve ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}</p>
                            <p className="text-gray-700 mb-4"><strong>จำนวนที่ยืมได้:</strong> {device.device_availability}</p>

                            <label className="block mb-2">
                                <span className="text-gray-700">จำนวนที่เลือก:</span>
                                <input
                                    type="number"
                                    value={selectedDevices[device.device_id] || 0}
                                    readOnly
                                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </label>
                        </div>
                    ))
                )}
            </div>

            <button
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition mt-6 mx-auto block"
                onClick={handleSubmitRequest}
            >
                ส่งคำร้อง
            </button>
        </div>
    );
};

export default CartPage;
