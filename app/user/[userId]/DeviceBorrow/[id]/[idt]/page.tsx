'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';

interface LoanRequest {
    loan_id: number;
    item_name: string;
    item_serial: string;
    user_email: string;
    loan_date: string;
    due_date: string | null;
    item_availability_status: string;
    item_id: number;
}

interface ApiResponse {
    user_id: number;
    transaction_id: number;
    requests: LoanRequest[];
}

const statusDisplay = {
    approve: { text: 'อนุมัติแล้ว', color: 'bg-emerald-100 text-emerald-800' },
    pending: { text: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800' },
    borrowed: { text: 'กำลังยืม', color: 'bg-sky-100 text-sky-800' },
    deny: { text: 'ปฏิเสธ', color: 'bg-rose-100 text-rose-800' },
    complete: { text: 'คืนแล้ว', color: 'bg-indigo-100 text-indigo-800' },
    ready: { text: 'พร้อมใช้งาน', color: 'bg-green-100 text-green-800' },
    cancel: { text: 'ถูกยกเลิก', color: 'bg-gray-100 text-gray-800' },
    available: { text: 'พร้อมใช้งาน', color: 'bg-green-100 text-green-800' },
};

const getStatusDisplay = (status: string) => {
    return statusDisplay[status as keyof typeof statusDisplay] || { text: 'ไม่ทราบสถานะ', color: 'bg-gray-100 text-gray-800' };
};

export default function DeviceRequests() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams<{id: string, idt: string}>();
    const router = useRouter();
    const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${apiUrl}/user/loan_detail/${params.id}/${params.idt}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลได้');
            }
            const result: ApiResponse = await response.json();
            setLoanRequests(result.requests);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
        }
    };

    useEffect(() => {
        fetchData();
    }, [params.id, params.idt]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button 
                className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
                onClick={() => router.back()} 
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
                    {loanRequests.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td>
                        </tr>
                    ) : (
                        loanRequests.map((detail) => (
                            <tr key={detail.loan_id}>
                                <td className="py-2 px-4 border-b">{detail.item_name}</td>
                                <td className="py-2 px-4 border-b">{detail.item_serial}</td>
                                <td className="py-2 px-4 border-b">{detail.user_email}</td>
                                <td className="py-2 px-4 border-b">{detail.loan_date}</td>
                                <td className="py-2 px-4 border-b">{detail.due_date ? detail.due_date : 'N/A'}</td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                {(() => {
                                    const { text, color } = getStatusDisplay(detail.item_availability_status);
                                        return (
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
                                            {text}
                                    </span>
                                );
                                    })()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
