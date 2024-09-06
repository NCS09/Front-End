'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useParams } from 'next/navigation';

interface Device {
    device_id: number;
    device_name: string;
    device_availability: number;
    device_description: string;
}

interface SelectedDevice {
    device_id: number;
    quantity: number;
}

const BorrowDevicePage: React.FC = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>(); // ดึงค่า userId จาก URL
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const res = await fetch(`${apiUrl}/devices`, {
                credentials: "include"
            });
            const data = await res.json();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeviceSelect = (device: Device) => {
        if (!selectedDevices.find(d => d.device_id === device.device_id)) {
            setSelectedDevices([...selectedDevices, { device_id: device.device_id, quantity: 1 }]);
        }
    };

    const handleDeviceChange = (deviceId: number, quantity: number) => {
        setSelectedDevices(prev =>
            prev.map(d => d.device_id === deviceId ? { ...d, quantity } : d)
        );
    };

    const handleRemoveDevice = (deviceId: number) => {
        setSelectedDevices(prev => prev.filter(d => d.device_id !== deviceId));
    };

    const generateQRCodeURL = (userId: string) => {
        const items = selectedDevices.map(device => ({
            device_id: device.device_id,
            quantity: device.quantity,
            due_date: dueDate,
            id: userId
        }));
        const itemsString = JSON.stringify(items);
        return `https://4f3c-202-80-249-144.ngrok-free.app/loan-data?data=${encodeURIComponent(itemsString)}`;
    };

    const handleGenerateQRCode = () => {
        if (selectedDevices.length === 0) {
            setError('Please select at least one device.');
            return;
        }
        if (selectedDevices.some(d => d.quantity <= 0)) {
            setError('Quantity must be greater than zero.');
            return;
        }
        console.log('user_id:', userId);
        if (!userId) {
            setError('User ID is required.');
            return;
        }
    
        setQrCodeURL(generateQRCodeURL(userId));
    };
    

    const filteredDevices = devices.filter(device =>
        device.device_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-purple-700">Borrow Device</h1>

            {/* Search Section */}
            <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-600">Search Devices</label>
                <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Search for devices..."
                />
            </div>

            {/* Device Selection Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDevices.map(device => (
                    <div
                        key={device.device_id}
                        onClick={() => handleDeviceSelect(device)}
                        className={`relative cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:bg-gray-100 transition z-10 ${device.device_availability > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
                        style={{ pointerEvents: device.device_availability > 0 ? 'auto' : 'none' }}
                    >
                        <h2 className="text-lg font-semibold text-gray-800">{device.device_name}</h2>
                        <p className="text-sm text-gray-600">{device.device_description}</p>
                        <p className={`mt-2 text-sm ${device.device_availability > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {device.device_availability > 0 ? `จำนวนที่ยืมได้: ${device.device_availability}` : 'ไม่สามารถยืมได้'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Selected Devices Form Section */}
            {selectedDevices.length > 0 && (
                <form className="space-y-6 bg-white p-6 rounded-lg shadow-lg mt-6 relative z-20">
                    <div className="space-y-4">
                        {selectedDevices.map(device => {
                            const deviceInfo = devices.find(d => d.device_id === device.device_id);
                            return (
                                <div key={device.device_id} className="border-b border-gray-200 pb-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{deviceInfo?.device_name}</h2>
                                        <input
                                            type="number"
                                            min="1"
                                            value={device.quantity}
                                            onChange={(e) => handleDeviceChange(device.device_id, Number(e.target.value))}
                                            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDevice(device.device_id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        นำออก
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600">กำหนดวันคืน</label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Error and Success Messages */}
                    {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
                    {success && <div className="text-green-600 text-sm mb-4">{success}</div>}

                    <button
                        type="button"
                        onClick={handleGenerateQRCode}
                        className="bg-purple-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-600"
                    >
                        สร้าง QR Code
                    </button>
                </form>
            )}

            {/* QR Code Display Section */}
            {qrCodeURL && (
                <div className="mt-6 text-center">
                    <QRCode value={qrCodeURL} />
                </div>
            )}
        </div>
    );
};

export default BorrowDevicePage;
