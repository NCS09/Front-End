'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: string;
    device_approve: boolean;
    device_limit: number;
}

const CartPage: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevices, setSelectedDevices] = useState<{ [key: string]: number }>({});
    const router = useRouter();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const deviceIds = searchParams.getAll('device_id');
        if (deviceIds.length > 0) {
            fetchDevices(deviceIds);
        }
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

    const handleQuantityChange = (deviceId: string, quantity: number) => {
        setSelectedDevices(prevSelected => ({
            ...prevSelected,
            [deviceId]: quantity,
        }));
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
                        user_id: 'your_user_id', // Replace with actual user ID
                        item_ids: selectedItems,
                        loan_status: 'pending', // or 'approved' based on your application logic
                        due_date: new Date().toISOString(), // or a specific due date
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit request');
                }

                const result = await response.json();
                alert(result.message || 'Request submitted successfully');
                router.push('/user/homepage'); // Redirect or handle successful submission
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
                            
                            {device.device_approve && parseInt(device.device_availability, 10) > 0 && (
                                <label className="block mb-2">
                                    <span className="text-gray-700">เลือกจำนวน:</span>
                                    <select
                                        value={selectedDevices[device.device_id] || 0}
                                        onChange={(e) => handleQuantityChange(device.device_id, parseInt(e.target.value))}
                                        className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                                    >
                                        {Array.from({ length: parseInt(device.device_availability, 10) }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </label>
                            )}
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
