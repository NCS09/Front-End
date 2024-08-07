'use client';

import { useState, useEffect } from 'react';
import AddDevicePopup from '@/app/components/auth/AddDevicePopup';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: boolean;
    device_approve: boolean;
    device_limit: string;
}

const ManagePage: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [data, setDevices] = useState<Device[]>([]);

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
            console.log('Fetched devices:', data); // เพิ่มการ log ข้อมูลที่ได้รับ
            setDevices(data); // ตรวจสอบให้แน่ใจว่า 'data.devices' มีข้อมูลที่ถูกต้อง
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage</h1>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleOpenPopup}>
                เพิ่มอุปกรณ์
            </button>
            {showPopup && <AddDevicePopup onClose={handleClosePopup} />}

            <div className='mt-4'>
                <ul>
                    {data.length === 0 ? (
                        <p>No data available.</p>
                    ) : (
                        data.map((device) => (
                            <li key={device.device_id} className="flex mb-2 p-4 border border-gray-300 rounded space-x-3">
                                <div className="">{device.device_name}</div>
                                <div>ID: {device.device_id}</div>
                                <div>Description: {device.device_description}</div>
                                <div>Availability: {device.device_availability ? 'Available' : 'Not Available'}</div>
                                <div>Approve: {device.device_approve ? 'Approved' : 'Not Approved'}</div>
                                <div>Limit: {device.device_limit}</div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ManagePage;
