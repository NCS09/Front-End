import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface DeviceItem {
    item_id: string;
    item_serial: string;
    item_availability: string;
}

const DeviceDetails: React.FC = () => {
    const { id } = useParams();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>();
    const router = useRouter();
    const [deviceItems, setDeviceItems] = useState<DeviceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<DeviceItem | null>(null);
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Invalid device ID');
            setLoading(false);
            return;
        }

        fetchDeviceItems();
    }, [id]);

    const fetchDeviceItems = async () => {
        try {
            const response = await fetch(`${apiUrl}/devices/${id}`, {
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

    const handleEditDevice = (item: DeviceItem) => {
        if (['pending', 'borrowed'].includes(item.item_availability)) {
            setUpdateMessage({ type: 'error', message: "Cannot edit items with 'pending' or 'borrowed' status" });
            return;
        }
        setEditingItem(item);
        setUpdateMessage(null);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setUpdateMessage(null);
    };

    const handleSaveEdit = async () => {
        if (!editingItem) return;

        try {
            const response = await fetch(`${apiUrl}/device_item/update`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    item_id: editingItem.item_id,
                    item_availability: editingItem.item_availability
                }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update device item');
            }

            setUpdateMessage({ type: 'success', message: 'Device item status updated successfully' });
            fetchDeviceItems(); // Refresh the list after update
            setEditingItem(null);
        } catch (error) {
            if (error instanceof Error) {
                setUpdateMessage({ type: 'error', message: error.message });
            } else {
                setUpdateMessage({ type: 'error', message: 'Error updating device item status' });
            }
            console.error('Error updating device item status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="loader text-purple-600">Loading...</div>
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
                    <div className="flex justify-center mb-6">
                        <button
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            onClick={() => router.push(`/admin/${userId}/Managedevices`)}>
                            กลับไปหน้าจัดการอุปกรณ์
                        </button>
                    </div>

                    {updateMessage && (
                        <div className={`mb-4 p-4 rounded ${updateMessage.type == 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {updateMessage.message}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Serial</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {deviceItems.map((item, index) => (
                                    <tr key={item.item_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.item_serial}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {editingItem?.item_id === item.item_id ? (
                                                <select
                                                    value={editingItem.item_availability}
                                                    onChange={(e) => setEditingItem({...editingItem, item_availability: e.target.value})}
                                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    <option>เลือก</option>
                                                    <option value="ready">Ready</option>
                                                    <option value="not ready">Not Ready</option>
                                                    
                                                </select>
                                            ) : (
                                                item.item_availability
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingItem?.item_id == item.item_id ? (
                                                <>
                                                    <button onClick={handleSaveEdit} className="text-indigo-600 hover:text-indigo-900 mr-2">Save</button>
                                                    <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900">Cancel</button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEditDevice(item)} 
                                                    className={`text-indigo-600 hover:text-indigo-900 ${['pending', 'borrowed'].includes(item.item_availability) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={['pending', 'borrowed'].includes(item.item_availability)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </td>
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