'use client';

import { useState, useEffect } from 'react';
import AddDevicePopup from '@/app/components/auth/AddDevicePopup';
import EditDevices from '@/app/components/auth/Editdevices';
import { useRouter } from 'next/navigation';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: string;
    device_approve: boolean;
    device_limit: number;
}

const ManagePage: React.FC = () => {
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [data, setDevices] = useState<Device[]>([]);
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

    const handleOpenAddPopup = () => setShowAddPopup(true);
    const handleCloseAddPopup = () => setShowAddPopup(false);

    const handleOpenEditPopup = (device: Device) => {
        setSelectedDevice(device);
        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        setSelectedDevice(null);
        setShowEditPopup(false);
    };

    const handleDeviceAction = (deviceId: string) => {
        router.push(`/admin/DeviceDetail/${deviceId}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">จัดการอุปกรณ์</h1>
            <button 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleOpenAddPopup}>
                เพิ่มอุปกรณ์
            </button>
            {showAddPopup && (
                <AddDevicePopup 
                    onClose={handleCloseAddPopup}
                    onUpdate={fetchDevices} />
            )}

            {showEditPopup && selectedDevice && (
                <EditDevices 
                    onClose={handleCloseEditPopup}
                    onUpdate={fetchDevices}
                    deviceId={selectedDevice.device_id}
                    dname={selectedDevice.device_name}
                    dlimit={selectedDevice.device_limit}
                    Approve={selectedDevice.device_approve}
                    descriptions={selectedDevice.device_description}/>
            )}

            <div className='mt-8'>
                {data.length === 0 ? (
                    <p className="text-center text-gray-600">ไม่มีข้อมูล</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.map((device) => (
                            <div key={device.device_id} className="flex flex-col p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
                                <h2 className="text-xl font-semibold mb-2">{device.device_name}</h2>
                                <p className="text-gray-700 mb-2"><strong>คำอธิบาย:</strong> {device.device_description}</p>
                                <p className="text-gray-700 mb-2"><strong>จำนวนที่ยืมได้:</strong> {device.device_availability}</p>
                                <p className="text-gray-700 mb-2"><strong>สถานะอุปกรณ์:</strong> <span className={device.device_approve ? 'text-green-600' : 'text-red-600'}>{device.device_approve ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}</span></p>
                                <p className="text-gray-700 mb-4"><strong>จำนวนอุปกรณ์:</strong> {device.device_limit}</p>
            
                                <div className="flex justify-between">
                                    <button 
                                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                                        onClick={() => handleOpenEditPopup(device)}>
                                        แก้ไข
                                    </button>
                                    <button
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                        onClick={() => handleDeviceAction(device.device_id)}>
                                        ดูอุปกรณ์
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePage;
