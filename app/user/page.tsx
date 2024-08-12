'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: string;
    device_approve: boolean;
    device_limit: number;
}

const UserHomepage: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await fetch("http://localhost:8000/devices", {
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
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const filteredDevices = devices.filter(device => 
        device.device_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeviceClick = (deviceId: string) => {
        router.push(`/user/Productss/${deviceId}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">อุปกรณ์ที่สามารถยืมได้</h1>

            <input 
                type="text"
                placeholder="ค้นหาอุปกรณ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 w-full p-2 border border-gray-300 rounded"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDevices.length === 0 ? (
                    <p className="text-center text-gray-600">ไม่พบอุปกรณ์ที่ค้นหา</p>
                ) : (
                    filteredDevices.map(device => (
                        <div key={device.device_id} className="flex flex-col p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                            <h2 className="text-xl font-semibold mb-2">{device.device_name}</h2>
                            <p className="text-gray-700 mb-2"><strong>คำอธิบาย:</strong> {device.device_description}</p>
                            <p className="text-gray-700 mb-2"><strong>สถานะอุปกรณ์:</strong> {device.device_approve ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}</p>
                            <p className="text-gray-700 mb-4"><strong>จำนวนที่ยืมได้:</strong> {device.device_availability}</p>
                            
                            <button 
                                className={`px-4 py-2 rounded transition mt-auto ${device.device_approve && parseInt(device.device_availability, 10) > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                                onClick={() => device.device_approve && parseInt(device.device_availability, 10) > 0 && handleDeviceClick(device.device_id)}
                                disabled={!device.device_approve || parseInt(device.device_availability, 10) === 0}
                            >
                                ส่งคำร้อง
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserHomepage;
