'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

interface LoanRequest {
    user_id: number;
    transaction_id: number;
    user_firstname: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    return_date: string | null;
    item_quantity: number;
    return_status: string;
}

export default function Historypage() {
    const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8000/admin/history", {
                method: 'GET',
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('การตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง');
            }
            
            const result: LoanRequest[] = await response.json();
            setLoanRequests(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลประวัติได้');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-500 text-white rounded">
                    <p>{errorMessage}</p>
                </div>
            )}

            <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">รหัสผู้ใช้</th>
                        <th className="p-2">รหัสรายการ</th>
                        <th className="p-2">ชื่อ</th>
                        <th className="p-2">อีเมล</th>
                        <th className="p-2">วันที่ยืม</th>
                        <th className="p-2">วันที่ครบกำหนด</th>
                        <th className="p-2">วันที่คืน</th>
                        <th className="p-2">จำนวน</th>
                        <th className="p-2">สถานะการคืน</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {loanRequests.map((request) => (
                        <tr key={request.transaction_id}>
                            <td className="p-2 border-b">{request.user_id}</td>
                            <td className="p-2 border-b">{request.transaction_id}</td>
                            <td className="p-2 border-b">{request.user_firstname}</td>
                            <td className="p-2 border-b">{request.user_email}</td>
                            <td className="p-2 border-b">{new Date(request.loan_date).toLocaleDateString()}</td>
                            <td className="p-2 border-b">{new Date(request.due_date).toLocaleDateString()}</td>
                            <td className="p-2 border-b">{request.return_date ? new Date(request.return_date).toLocaleDateString() : 'ไม่เคยคืน'}</td>
                            <td className="p-2 border-b">{request.item_quantity}</td>
                            <td className="p-2 border-b">{request.return_status}</td>
                            <td className="p-2 border-b">
                                <button className="text-blue-500 hover:underline" onClick={() => router.push(`/history/${request.transaction_id}`)}>
                                    <Eye className="inline" /> 
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
