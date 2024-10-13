'use client';

import { useState } from 'react';
import Modal from './Modal'; 

interface DeleteDeviceProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    deviceId: string | null;
}

const DeleteDevice: React.FC<DeleteDeviceProps> = ({ isOpen, onClose, onConfirm, deviceId }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const id = deviceId;
    const handleConfirm = async () => {
        if (deviceId) {
            try {

                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/devices/delete`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({id}),
                        
                    
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
