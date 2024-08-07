'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddDevicePopup from '@/app/components/auth/AddDevicePopup';

const ManagePage: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Manage</h1>
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleOpenPopup}
            >
                เพิ่มอุปกรณ์
            </button>
            {showPopup && <AddDevicePopup onClose={handleClosePopup} />}
        </div>
    );
};

export default ManagePage;
