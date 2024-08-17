import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Device {
    device_id: string;
    device_name: string;
    device_description: string;
    device_serial:string;
    device_availability: string;
    device_approve: boolean;
    device_limit: string;
}

interface DeviceItem {
    item_id: string;
    item_serial: string; // เปลี่ยนเป็น item_name
    item_availability: string;
}

const DeviceDetails: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [device, setDevice] = useState<Device | null>(null);
    const [deviceItems, setDeviceItems] = useState<DeviceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await fetch(`http://localhost:8000/devices/${id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('เครือข่ายมีปัญหา');
                }

                const data = await response.json();
                setDevice(data.device);
                setDeviceItems(data.items); // สมมุติว่า 'items' เป็นส่วนหนึ่งของการตอบกลับ
            } catch (error) {
                setError('เกิดข้อผิดพลาดในการดึงรายละเอียดอุปกรณ์');
                console.error('ข้อผิดพลาดในการดึงรายละเอียดอุปกรณ์:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevice();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader">กำลังโหลด...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    if (!device) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">ไม่พบอุปกรณ์</div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-6">
                    <h1 className="text-4xl font-bold text-white mb-4">{device.device_name}</h1>
                    <p className="text-white mb-4"><strong>สถานะอุปกรณ์:</strong> {device.device_approve ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}</p>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-4"><strong>คำอธิบาย:</strong> {device.device_description}</p>
                    <p className="text-gray-700 mb-4"><strong>จำนวนที่ยืมได้:</strong> {device.device_availability}</p>
                    <p className="text-gray-700 mb-6"><strong>จำนวนอุปกรณ์ทั้งหมด:</strong> {device.device_limit}</p>

                    {/* ตารางแสดงรายการของอุปกรณ์ */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID อุปกรณ์</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {deviceItems.map((item,index) => (
                                    <tr key={item.item_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.item_serial}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.item_availability}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ปุ่มกลับไปยังหน้าจัดการอุปกรณ์ */}
            <div className="flex justify-center mt-6">
                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => router.push('/admin/Managedevices')}>
                    กลับไปยังหน้าจัดการอุปกรณ์
                </button>
            </div>
        </div>
    );
};

export default DeviceDetails;
