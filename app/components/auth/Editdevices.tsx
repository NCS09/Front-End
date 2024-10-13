import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

interface EditDeviceProps {
    onClose: () => void;
    onUpdate: () => void;
    deviceId: string;
    dname: string;
    dlimit: number;
    descriptions: string;
    Approve: boolean;
    sserial:string;
    dtype: string;
}

const EditDevices: React.FC<EditDeviceProps> = ({ onClose, onUpdate, deviceId, Approve, dname, dlimit, descriptions, sserial, dtype }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [approve, setApprove] = useState<boolean>(Approve);
    const [name, setName] = useState<string>(dname);
    const [limit, setLimit] = useState<number>(dlimit);
    const [description, setDescription] = useState<string>(descriptions);
    const [serial, setSerial] = useState<string>(sserial);
    const [dtypes, setDutys] = useState<string>(dtype);
    const [message, setMessage] = useState<string>('');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = {
            id: deviceId,
            approve,
            name,
            limit,
            description,
            serial,
        };

        try {

            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/device/update`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
                
            });

            const result = await response.json();
            setMessage(result.message);

            if (response.ok) {
                onClose();
                onUpdate();
            }

        } catch (error) {
            console.error('Error updating device:', error);
            setMessage('Error updating device');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">แก้ไขอุปกรณ์</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className="block text-gray-700">ชื่อ:</label>
                        <input 
                            type="text"
                            name="device_name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">จำนวน:</label>
                        <input 
                            type="number"
                            name="device_limit"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="mt-1 p-2 w-full border border-gray-300 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">สถานะอุปกรณ์:</label>
                        <select
                            value={approve ? 'true' : 'false'}
                            onChange={(e) => setApprove(e.target.value == 'true')}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        >
                            <option value="true">พร้อมใช้งาน</option>
                            <option value="false">ไม่พร้อมใช้งาน</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                            อัปเดต
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={onClose}>
                            ปิด
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default EditDevices;
