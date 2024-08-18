'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

interface LoanDetail {
    loan_id: string;
    item_name: string;
    item_serial: string;
    user_email: string;
    loan_date: string;
    due_date: string | null;
    loan_status: string;
}

export default function LoanDetailPage() {
    const params  = useParams<{id: string , idt: string}>();
    const router = useRouter(); 
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/admin/loan_detail/${params.id}/${params.idt}`, {
                    method: 'GET',
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
                }

                const result = await response.json();
                setLoanDetails(result.requests); // รับ requests จาก response
            } catch (error) {
                console.log("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
            }
        };
        fetchData();
    }, [params.id, params.idt]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button 
                className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
                onClick={() => router.back()} // เพิ่มปุ่มย้อนกลับที่มุมบนซ้าย
            >
                ย้อนกลับ
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">รายละเอียดการยืม</h1>

            {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ชื่ออุปกรณ์</th>
                        <th className="py-2 px-4 border-b">รหัสอุปกรณ์</th>
                        <th className="py-2 px-4 border-b">อีเมลผู้ใช้</th>
                        <th className="py-2 px-4 border-b">วันที่ยืม</th>
                        <th className="py-2 px-4 border-b">วันที่คืน</th>
                        <th className="py-2 px-4 border-b">สถานะการยืม</th>
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
                                <td className="py-2 px-4 border-b">{detail.item_name}</td>
                                <td className="py-2 px-4 border-b">{detail.item_serial}</td>
                                <td className="py-2 px-4 border-b">{detail.user_email}</td>
                                <td className="py-2 px-4 border-b">{detail.loan_date}</td>
                                <td className="py-2 px-4 border-b">{detail.due_date}</td>
                                <td className="py-2 px-4 border-b">{detail.loan_status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
