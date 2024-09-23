'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import AddDevicePopup from '@/app/components/auth/AddDevicePopup';
import EditDevices from '@/app/components/auth/Editdevices';
import DeleteDevice from '@/app/components/auth/DeleteDevice';
import { useRouter } from 'next/navigation';
import { Search, Edit3, Eye, Trash2 } from 'lucide-react';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_availability: string;
    device_approve: boolean;
    device_limit: number;
    device_serial: string;
    device_type: string;
}

const ManagePage: React.FC = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>();
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const router = useRouter();

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await fetch(`${apiUrl}/devices`, {
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
        router.push(`/admin/${userId}/DeviceDetail/${deviceId}`);
    };

    const handleOpenDeleteModal = (deviceId: string) => {
        setDeviceToDelete(deviceId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setDeviceToDelete(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = () => {
        fetchDevices(); // Refresh the list after deletion
        handleCloseDeleteModal(); // Close the delete modal after confirming
    };

    const filteredDevices = devices.filter((device) =>
        (device.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.device_description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedType === 'all' || device.device_type === selectedType)
    );

    const deviceTypes = ['all', ...Array.from(new Set(devices.map(device => device.device_type)))];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">จัดการอุปกรณ์</h1>
            <div className="flex justify-between mb-4">
                <button 
                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
                    onClick={handleOpenAddPopup}>
                    เพิ่มอุปกรณ์
                </button>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="border rounded-lg p-2 focus:outline-none focus:border-purple-600"
                    >
                        {deviceTypes.map((type) => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'ทั้งหมด' : type}
                            </option>
                        ))}
                    </select>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="ค้นหาอุปกรณ์..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-purple-600"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>
            </div>

            {showAddPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <AddDevicePopup 
                        onClose={handleCloseAddPopup}
                        onUpdate={fetchDevices} />
                </div>
            )}

            {showEditPopup && selectedDevice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <EditDevices 
                        onClose={handleCloseEditPopup}
                        onUpdate={fetchDevices}
                        deviceId={selectedDevice.device_id}
                        dname={selectedDevice.device_name}
                        dlimit={selectedDevice.device_limit}
                        Approve={selectedDevice.device_approve}
                        descriptions={selectedDevice.device_description}
                        sserial={selectedDevice.device_serial}
                        dtype={selectedDevice.device_type}/>
                </div>
            )}

            <div className='mt-8'>
                {filteredDevices.length === 0 ? (
                    <p className="text-center text-gray-600">ไม่มีข้อมูล</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ชื่ออุปกรณ์</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">คำอธิบาย</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">จำนวนที่ยืมได้</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">จำนวนอุปกรณ์</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">ประเภท</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">สถานะอุปกรณ์</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDevices.map((device) => (
                                    <tr key={device.device_id} className="border-t hover:bg-gray-100 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{device.device_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{device.device_description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center">{device.device_availability}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center">{device.device_limit}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center">{device.device_type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                            <span className={device.device_approve ? 'text-green-600' : 'text-red-600'}>
                                                {device.device_approve ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 flex space-x-2 justify-center">
                                            <button 
                                                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                                                onClick={() => handleOpenEditPopup(device)}>
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                                                onClick={() => handleDeviceAction(device.device_id)}>
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                                                onClick={() => handleOpenDeleteModal(device.device_id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <DeleteDevice
                        isOpen={showDeleteModal}
                        onClose={handleCloseDeleteModal}
                        onConfirm={handleConfirmDelete}
                        deviceId={deviceToDelete}
                    />
                </div>
            )}
        </div>
    );
};

export default ManagePage;