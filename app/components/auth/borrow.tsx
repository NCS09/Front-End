'use client'

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useParams } from 'next/navigation';

interface Device {
    device_id: number;
    device_name: string;
    device_description: string;
    device_availability: number;
    device_limit: number;
    device_approve: boolean;
    device_serial: string;
    device_type: string;
}

interface SelectedDevice {
    device_id: number;
    quantity: number;
}

const DEVICE_TYPES = [
    'ครุภัณฑ์ประจำห้องปฏิบัติการ',
    'วัสดุคงทนถาวรประจำห้องปฏิบัติการ',
    'วัสดุสิ้นเปลืองประจำห้องปฏิบัติการ'
];

const BorrowDevicePage: React.FC = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>();
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [dueTime, setDueTime] = useState<string>('09:00');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('ทั้งหมด');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/devices`, {
                credentials: "include"
            });
            const data = await res.json();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setError('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDeviceSelect = (device: Device) => {
        if (device.device_availability > 0 && device.device_approve) {
            const existingDevice = selectedDevices.find(d => d.device_id === device.device_id);
            if (existingDevice) {
                if (existingDevice.quantity < device.device_availability) {
                    handleDeviceChange(device.device_id, existingDevice.quantity + 1);
                } else {
                    setError(`ไม่สามารถยืมอุปกรณ์ ${device.device_name} เพิ่มได้ เนื่องจากเกินจำนวนที่มีอยู่`);
                }
            } else {
                setSelectedDevices([...selectedDevices, { device_id: device.device_id, quantity: 1 }]);
            }
        }
    };

    const handleDeviceChange = (deviceId: number, quantity: number) => {
        const device = devices.find(d => d.device_id === deviceId);
        if (device && quantity <= device.device_availability) {
            setSelectedDevices(prev =>
                prev.map(d => d.device_id === deviceId ? { ...d, quantity } : d)
            );
            setError(null);
        } else {
            setError(`จำนวนที่ยืมเกินกว่าจำนวนที่มีอยู่`);
        }
    };

    const handleRemoveDevice = (deviceId: number) => {
        setSelectedDevices(prev => prev.filter(d => d.device_id !== deviceId));
    };

    const generateQRCodeURL = (userId: string) => {
        const items = selectedDevices.map(device => ({
            device_id: device.device_id,
            quantity: device.quantity,
            due_date: `${dueDate} ${dueTime}`,
            id: userId
        }));
        const itemsString = JSON.stringify(items);
        return `https://2eea-2403-6200-8853-761e-4840-88db-9989-4a03.ngrok-free.app/loan-data?data=${encodeURIComponent(itemsString)}`;
    };

    const handleGenerateQRCode = () => {
        if (selectedDevices.length === 0) {
            setError('กรุณาเลือกอุปกรณ์อย่างน้อย 1 ชิ้น');
            return;
        }
        if (selectedDevices.some(d => d.quantity <= 0)) {
            setError('จำนวนอุปกรณ์ต้องมากกว่า 0');
            return;
        }
        if (!userId) {
            setError('ต้องการ User ID');
            return;
        }
        if (!dueDate || !dueTime) {
            setError('กรุณาระบุวันและเวลาที่จะมารับอุปกรณ์');
            return;
        }
    
        setQrCodeURL(generateQRCodeURL(userId));
        setSuccess('สร้าง QR Code สำเร็จ');
    };

    const handleClose = () => {
        setQrCodeURL(null);
        window.location.reload(); 
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDueTime(e.target.value);
    };

    const timeOptions = [];
    for (let hour = 9; hour <= 16; hour++) {
        timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour !== 16) {
            timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
        }
    }

    const getDeviceTypes = (devices: Device[]): string[] => {
        const types = ['ทั้งหมด'];
        DEVICE_TYPES.forEach(type => {
            if (devices.some(device => device.device_type === type)) {
                types.push(type);
            }
        });
        return types;
    };

    const deviceTypes = getDeviceTypes(devices);

    const filteredDevices = devices.filter(device =>
        (activeTab === 'ทั้งหมด' || device.device_type === activeTab) &&
        device.device_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-purple-700">ยืมอุปกรณ์</h1>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex mb-4 overflow-x-auto">
                    {deviceTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`mr-2 px-4 py-2 rounded whitespace-nowrap ${
                                activeTab === type
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <div className="relative" ref={dropdownRef}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="พิมพ์ชื่ออุปกรณ์ที่ต้องการค้นหา..."
                        className="w-full p-2 border rounded"
                    />
                    {showDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredDevices.map(device => (
                                <div
                                    key={device.device_id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSearchTerm(device.device_name);
                                        setShowDropdown(false);
                                        handleDeviceSelect(device);
                                    }}
                                >
                                    {device.device_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredDevices.map(device => (
                        <div
                            key={device.device_id}
                            onClick={() => handleDeviceSelect(device)}
                            className={`bg-white p-4 rounded-lg shadow transition ${
                                device.device_availability > 0 && device.device_approve
                                    ? 'cursor-pointer hover:shadow-md'
                                    : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                            <h3 className="font-semibold text-lg mb-2">{device.device_name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{device.device_description}</p>
                            <p className="text-sm text-gray-500 mb-2">รหัส: {device.device_serial}</p>
                            <span className={`px-2 py-1 rounded text-sm ${
                                device.device_availability > 0 && device.device_approve
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {device.device_availability > 0 && device.device_approve
                                    ? `ยืมได้: ${device.device_availability}`
                                    : 'ไม่สามารถยืมได้'}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {selectedDevices.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow mt-6">
                    <h2 className="text-xl font-semibold mb-4">อุปกรณ์ที่เลือก</h2>
                    <div className="space-y-4">
                        {selectedDevices.map(device => {
                            const deviceInfo = devices.find(d => d.device_id === device.device_id);
                            return (
                                <div key={device.device_id} className="flex justify-between items-center border-b pb-4">
                                    <div>
                                        <h3 className="font-semibold">{deviceInfo?.device_name}</h3>
                                        <input
                                            type="number"
                                            min="1"
                                            max={deviceInfo?.device_availability}
                                            value={device.quantity}
                                            onChange={(e) => handleDeviceChange(device.device_id, Number(e.target.value))}
                                            className="mt-2 p-1 border rounded w-24"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveDevice(device.device_id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        นำออก
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-600 mb-2">
                            กำหนดวันและเวลามารับของ (9:00 - 16:00)
                        </label>
                        <div className="flex space-x-4">
                            <input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <select
                                id="dueTime"
                                value={dueTime}
                                onChange={handleTimeChange}
                                className="w-full p-2 border rounded"
                            >
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerateQRCode}
                        className="mt-4 w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
                    >
                        สร้าง QR Code
                    </button>
                </div>
            )}

{error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}

            {qrCodeURL && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <QRCode value={qrCodeURL} />
                        <p className="mt-4">สแกน QR Code เพื่อยืนยันการยืมอุปกรณ์</p>
                        <button
                            onClick={handleClose}
                            className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowDevicePage;