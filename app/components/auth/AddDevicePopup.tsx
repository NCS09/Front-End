import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Hash, Briefcase, Cpu, MapPin, User, FileText, Package, Tag } from 'lucide-react';

interface AddDevicePopupProps {
    onClose: () => void;
    onUpdate: () => void;
}

const AddDevicePopup: React.FC<AddDevicePopupProps> = ({ onClose, onUpdate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [limit, setLimit] = useState('');
    const [serial, setSerial] = useState('');
    const [type, setType] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [location, setLocation] = useState('');
    const [responsible, setResponsible] = useState('');
    const [message, setMessage] = useState('');

    const validTypes = [
        'ครุภัณฑ์ประจำห้องปฏิบัติการ',
        'วัสดุคงทนถาวรประจำห้องปฏิบัติการ',
        'วัสดุสิ้นเปลืองประจำห้องปฏิบัติการ'
    ];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const limitValue = Number(limit);
        if (isNaN(limitValue) || limitValue < 1) {
            setMessage('จำนวนอุปกรณ์ต้องเป็นตัวเลขที่มากกว่าศูนย์');
            return;
        }

        if (!validTypes.includes(type)) {
            setMessage('ประเภทอุปกรณ์ไม่ถูกต้อง');
            return;
        }

        const formData = { name, description, limit: limitValue, serial, type, brand, model, location, responsible };

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
            <div className="bg-white p-8 rounded shadow-lg w-96 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">เพิ่มอุปกรณ์</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <Box className="mr-2" size={18} />
                            ชื่อครุภัณฑ์
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <Hash className="mr-2" size={18} />
                            หมายเลขครุภัณฑ์
                        </label>
                        <input
                            type="text"
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <Briefcase className="mr-2" size={18} />
                            ยี่ห้อ
                        </label>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <Cpu className="mr-2" size={18} />
                            รุ่น/โมเดล
                        </label>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <MapPin className="mr-2" size={18} />
                            สถานที่ใช้งาน
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <User className="mr-2" size={18} />
                            ชื่อผู้รับผิดชอบ
                        </label>
                        <input
                            type="text"
                            value={responsible}
                            onChange={(e) => setResponsible(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <FileText className="mr-2" size={18} />
                            คำอธิบาย
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <Package className="mr-2" size={18} />
                            จำนวนอุปกรณ์
                        </label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (value >= 1) {
                                    setLimit(e.target.value);
                                }
                            }}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 mb-2 flex items-center">
                            <Tag className="mr-2" size={18} />
                            ประเภทอุปกรณ์
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        >
                            <option value="">เลือกประเภทอุปกรณ์</option>
                            {validTypes.map((validType) => (
                                <option key={validType} value={validType}>
                                    {validType}
                                </option>
                            ))}
                        </select>
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