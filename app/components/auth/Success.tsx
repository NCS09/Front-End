'use client';

import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-80 p-6 rounded-lg shadow-lg text-center">
                <h1 className="font-bold text-lg mb-4 text-white">ลงทะเบียนสำเร็จ</h1>
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 flex justify-center items-center bg-green-100 rounded-full border-2 border-green-600">
                        <FaCheck className="text-5xl text-green-600" />
                    </div>
                </div>
                <Link
                    href="/Login"
                    className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                    onClick={onClose}
                >
                    กลับสู่หน้าล๊อคอิน
                </Link>
            </div>
        </div>
    );
};

export default SuccessModal;
