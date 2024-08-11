import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddDevicePopupProps {
    onClose: () => void;
    onUpdate: () => void;
}

const AddDevicePopup: React.FC<AddDevicePopupProps> = ({ onClose, onUpdate }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [limit, setLimit] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = { id, name, description, limit };

        try {
            const response = await fetch("http://localhost:8000/devices/add", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const result = await response.json();
            setMessage(result.message);
            console.log(result);
            if (response.ok) {
                onClose();
                onUpdate();
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error adding device');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">เพิ่มอุปกรณ์</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">ID อุปกรณ์:</label>
                        <input 
                            type="text" 
                            name="deviceId" 
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">ชื่ออุปกรณ์:</label>
                        <input 
                            type="text" 
                            name="device_name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">คำอธิบาย:</label>
                        <textarea 
                            name="description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">จำนวนอุปกรณ์:</label>
                        <input 
                            type="number" 
                            name="limit" 
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button 
                            type="submit" 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                            เพิ่ม
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

export default AddDevicePopup;
