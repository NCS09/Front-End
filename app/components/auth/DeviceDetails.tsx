import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface DeviceItem {
    item_id: string;
    item_serial: string;
    item_availability: string;
}

const DeviceDetails: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [deviceItems, setDeviceItems] = useState<DeviceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Invalid device ID');
            setLoading(false);
            return;
        }

        const fetchDeviceItems = async () => {
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
                setDeviceItems(data.items || []);
            } catch (error) {
                setError('Error fetching device items');
                console.error('Error fetching device items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceItems();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="loader text-purple-600">กำลังโหลด...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    {/* ปุ่มกลับไปยังหน้าจัดการอุปกรณ์ */}
                    <div className="flex justify-center mb-6">
                        <button
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            onClick={() => router.push('/admin/Managedevices')}>
                            กลับไปยังหน้าจัดการอุปกรณ์
                        </button>
                    </div>

                    {/* ตารางแสดงรายการของอุปกรณ์ */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">NO.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Serial</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {deviceItems.map((item, index) => (
                                    <tr key={item.item_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.item_serial}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.item_availability}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetails;
