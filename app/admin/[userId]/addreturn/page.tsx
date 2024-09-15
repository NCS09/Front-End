'use client';

import { useEffect, useState } from "react";
import { useRouter,useParams } from 'next/navigation';
import { Eye, X } from 'lucide-react';

export default function DeviceRequests() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params  = useParams<{userId: string}>();
    const [loanRequests, setLoanRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/loan_detail`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
    
            const result = await response.json();
            setLoanRequests(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleCancel = async (transaction_id: string) => {
        try {
            const response = await fetch(`${apiUrl}/cancel-loan/${transaction_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'ไม่สามารถยกเลิกการยืมได้');
            }
            const result = await response.json();
            console.log(result.message);

            await fetchData();

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการยกเลิก:", error);
            setErrorMessage('เกิดข้อผิดพลาดในการยกเลิกคำร้องการยืม');
        }
    };

    const handleViewDetails = (user_id: string, transaction_id: string) => {
        router.push(`/admin/${user_id}/Requests/${user_id}/${transaction_id}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">คำร้องการยืมของคุณ</h1>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {loanRequests.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b">ชื่อผู้ใช้</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">รหัสคำร้อง</th>
                                <th className="py-2 px-4 border-b">สถานะ</th>
                                <th className="py-2 px-4 border-b">วันที่ยืม</th>
                                <th className="py-2 px-4 border-b">วันและเวลาที่มารับของ</th>
                                <th className="py-2 px-4 border-b">จำนวน</th>
                                <th className=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanRequests.map((request: any) => (
                                <tr key={request.transaction_id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center">{request.user_firstname}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.user_email}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.transaction_id}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.loan_status}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.loan_date}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.due_date}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.item_quantity}</td>
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <button 
                                            onClick={() => handleViewDetails(request.user_id, request.transaction_id)} 
                                            className="text-blue-500 hover:text-blue-700 border-none">
                                                <Eye className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(request.transaction_id)} 
                                            className="text-red-500 hover:text-red-700 border-none">
                                                <X className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">ไม่มีคำร้องการยืมในขณะนี้</p>
            )}
        </div>
    );
}
