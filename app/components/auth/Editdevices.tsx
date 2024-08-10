import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditDeviceProps {
    onClose: () => void;
    deviceId: string;
    initialAvailability: boolean;
    initialApprove: boolean;
}

const EditDevices: React.FC<EditDeviceProps> = ({ onClose, deviceId, initialAvailability, initialApprove }) => {
    const [availability, setAvailability] = useState(initialAvailability ? 'true' : 'false');
    const [approve, setApprove] = useState(initialApprove ? 'true' : 'false');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = {
            id: deviceId,
            availability: availability === 'true',
            approve: approve === 'true',
        };

        try {
            const response = await fetch("http://localhost:8000/device/update", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const result = await response.json();
            setMessage(result.message);

            if (response.ok) {
                console.log("Replacing and reloading...");
                onClose();
                router.replace('/admin/Managedevices');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error updating device');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">แก้ไขอุปกรณ์</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">สถานะการใช้งาน:</label>
                        <select
                            // value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        >
                            <option value="true">พร้อมใช้งาน</option>
                            <option value="false">ไม่พร้อมใช้งาน</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">อนุมัติ:</label>
                        <select
                            // value={approve}
                            onChange={(e) => setApprove(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        >
                            <option value="true">อนุมัติ</option>
                            <option value="false">ไม่อนุมัติ</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                        อัปเดต
                    </button>
                </form>
                <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={onClose}>
                    ปิด
                </button>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default EditDevices;
