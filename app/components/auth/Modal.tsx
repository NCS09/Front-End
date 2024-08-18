import React from 'react';

interface confirm {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmText: string;
    cancelText: string;
}

const Modal: React.FC<confirm> = ({ isOpen, onClose, onConfirm, title, confirmText, cancelText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div className="flex justify-between">
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        onClick={onConfirm}>
                        {confirmText}
                    </button>
                    <button
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                        onClick={onClose}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
