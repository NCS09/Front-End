'use client';

import { useState } from 'react';
import Modal from '@/app/components/auth/Model'; // Import Modal

interface DeleteDeviceProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    deviceId: string | null;
}

const DeleteDevice: React.FC<DeleteDeviceProps> = ({ isOpen, onClose, onConfirm, deviceId }) => {
    const id = deviceId;
    const handleConfirm = async () => {
        if (deviceId) {
            try {
                const response = await fetch("http://localhost:8000/devices/delete", {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id}),
                        
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete device');
                }

                onConfirm(); // Notify parent to refresh the device list
                onClose(); // Close the modal
            } catch (error) {
                console.error('Error deleting device:', error);
            }
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title="ยืนยันการนำออก"
            confirmText="นำออก"
            cancelText="ยกเลิก"
        />
    );
};

export default DeleteDevice;
