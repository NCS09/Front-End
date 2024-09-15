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
}

export default function DeviceRequests() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams();
    const [loanRequests, setLoanRequests] = useState<LoanHistory[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        if (!apiUrl) {
            setErrorMessage('API URL ไม่ได้ถูกตั้งค่า');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/user/history/${userId}`, {
                method: 'GET',
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setErrorMessage('ไม่พบประวัติสำหรับผู้ใช้ที่ระบุ');
                } else {
                    throw new Error('Network response was not ok');
                }
                return;
            }

            const result = await response.json();
            setLoanRequests(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลประวัติการยืมได้');
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'ไม่ระบุ';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusColor = (returnDate: string | null) => {
        if (!returnDate) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (returnDate: string | null) => {
        return returnDate ? 'คืนแล้ว' : 'ยังไม่คืน';
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
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.return_date)}`}>
                                        {getStatusText(request.return_date)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => router.push(`/user/${userId}/userhistory/${userId}/${request.transaction_id}`)}
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