'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

interface LoanDetail {
    loan_id: string;
    user_firstname: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    item_quantity: string;
    user_id: string;
}

export default function LoanDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/admin/loan_detail", {
                    method: 'GET',
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
                }

                const result = await response.json();
                setLoanDetails(result);
            } catch (error) {
                console.log("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
            }
        };
        fetchData();
    }, []);

    const handleViewDetails = (user_id: string) => {
        // Implement view details functionality
        router.push(`/admin/Requests/${user_id}`);
    };

    const handleConfirm = (loan_id: string) => {
        // Implement confirm functionality
        console.log(`Confirming loan with ID: ${loan_id}`);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">คำร้องขอยืม</h1>

            {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ชื่อผูัใช้</th>
                        <th className="py-2 px-4 border-b">อีเมล</th>
                        <th className="py-2 px-4 border-b">วันที่ยืม</th>
                        <th className="py-2 px-4 border-b">กำหนดคืน</th>
                        <th className="py-2 px-4 border-b">จำนวน</th>
                        <th className="py-2 px-4 border-b">การจัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {loanDetails.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td>
                        </tr>
                    ) : (
                        loanDetails.map((detail) => (
                            <tr key={detail.loan_id}>
                                <td className="py-2 px-4 border-b">{detail.user_firstname}</td>
                                <td className="py-2 px-4 border-b">{detail.user_email}</td>
                                <td className="py-2 px-4 border-b">{detail.loan_date}</td>
                                <td className="py-2 px-4 border-b">{detail.due_date}</td>
                                <td className="py-2 px-4 border-b">{detail.item_quantity}</td>
                                <td className="py-2 px-4 border-b">
                                    <button 
                                        onClick={() => handleViewDetails(detail.user_id)} 
                                        className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                                    >
                                        ดูรายละเอียด
                                    </button>
                                    <button 
                                        onClick={() => handleConfirm(detail.loan_id)} 
                                        className="bg-green-500 text-white py-1 px-3 rounded"
                                    >
                                        ยืนยัน
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
