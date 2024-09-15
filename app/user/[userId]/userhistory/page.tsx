'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

interface LoanHistory {
    user_id: number;
    transaction_id: number;
    user_firstname: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    return_date: string | null;
    item_quantity: number;
    return_status: 'returned' | 'lost' | 'damaged';
}

export default function DeviceRequests() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>();
    const [loanRequests, setLoanRequests] = useState<LoanHistory[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/history/${userId}`, {
                method: 'GET',
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setLoanRequests(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลประวัติการยืมได้');
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [userId]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'ไม่ระบุ';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'lost':
                return 'bg-red-100 text-red-800';
            case 'damaged':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'returned':
                return 'คืนแล้ว';
            case 'lost':
                return 'สูญหาย';
            case 'damaged':
                return 'ชำรุด';
            default:
                return status;
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">ประวัติการยืมอุปกรณ์ทั้งหมด</h1>
            
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ยืม</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กำหนดคืน</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่คืน</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loanRequests.map((request) => (
                            <tr key={request.transaction_id}>
                                <td className="px-6 py-4 whitespace-nowrap">{request.user_firstname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{request.user_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.loan_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.due_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.return_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{request.item_quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.return_status)}`}>
                                        {getStatusText(request.return_status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => router.push(`/admin/${userId}/Requests/${request.user_id}/${request.transaction_id}`)}
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