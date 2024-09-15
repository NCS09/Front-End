'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import { Eye, RotateCcw } from 'lucide-react';

interface LoanRequest {
    user_id: number;
    transaction_id: number;
    user_firstname: string;
    user_email: string;
    user_phone: string;
    loan_date: string;
    due_date: string;
    item_quantity: number;
    loan_status: string;
    item_ids: string;
}

export default function ReturnDevice() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>();
    const [returnDevices, setReturnDevices] = useState<LoanRequest[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/loan_detail/borrowed/${userId}`, {
                method: 'GET',
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setReturnDevices(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [userId]);

    const handleReturn = async (transaction_id: number) => {
        // Implement return logic here
        console.log(`Returning items for transaction ${transaction_id}`);
        // You should call an API endpoint to process the return
        // After successful return, refresh the data
        // fetchData();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">รายการอุปกรณ์ที่รอคืน</h1>
            
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ยืม</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ยืม</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กำหนดคืน</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {returnDevices.map((device) => (
                            <tr key={device.transaction_id}>
                                <td className="px-6 py-4 whitespace-nowrap">{device.user_firstname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{device.user_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{device.user_phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(device.loan_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(device.due_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{device.item_quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {device.loan_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleReturn(device.transaction_id)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <RotateCcw className="inline-block w-5 h-5 mr-1" />
                                        คืน
                                    </button>
                                    <button
                                        onClick={() => router.push(`/user/${userId}/return/${device.user_id}/${device.transaction_id}`)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Eye className="inline-block w-5 h-5 mr-1" />
                                        รายละเอียด
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}