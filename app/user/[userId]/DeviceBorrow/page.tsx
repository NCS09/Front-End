'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import { Eye, X, QrCode } from 'lucide-react';
import Image from 'next/image';

interface LoanRequest {
    user_id: string;
    transaction_id: string;
    user_firstname: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    item_quantity: string;
    loan_status: string;
    transaction_qrcode: string;
}

const statusDisplay = {
    approve: { text: 'อนุมัติแล้ว', color: 'bg-emerald-100 text-emerald-800' },
    pending: { text: 'รอดำเนินการ', color: 'bg-amber-100 text-amber-800' },
    borrowed: { text: 'กำลังยืม', color: 'bg-sky-100 text-sky-800' },
    deny: { text: 'ปฏิเสธ', color: 'bg-rose-100 text-rose-800' },
    complete: { text: 'คืนแล้ว', color: 'bg-indigo-100 text-indigo-800' },
    ready: { text: 'พร้อมใช้งาน', color: 'bg-green-100 text-green-800' },
    cancel: { text: 'ถูกยกเลิก', color: 'bg-gray-100 text-gray-800' },
};

const getStatusDisplay = (status: string) => {
    return statusDisplay[status as keyof typeof statusDisplay] || { text: 'ไม่ทราบสถานะ', color: 'bg-gray-100 text-gray-800' };
};

export default function DeviceRequests() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams<{userId: string}>();
    const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
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
    
            if (!response.ok) {
                if (response.status === 404) {
                    setLoanRequests([]);
                    return;
                }
                throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
            }

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
                throw new Error(errorData.message || 'ไม่สามารถยกเลิกการยืมได้เนื่องจากคำร้องมีอายุเกิน 12 ชั่วโมง');
            }
            const result = await response.json();
            console.log(result.message);
            setSuccessMessage('ยกเลิกคำร้องการยืมสำเร็จ');
            
            const updatedRequests = loanRequests.filter(request => request.transaction_id !== transaction_id);
            setLoanRequests(updatedRequests);

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการยกเลิก:", error);
            setErrorMessage('เกิดข้อผิดพลาดในการยกเลิกคำร้องการยืม');
        } finally {
            setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleViewDetails = (user_id: string, transaction_id: string) => {
        router.push(`/user/${user_id}/DeviceBorrow/${user_id}/${transaction_id}`);
    };

    const handleShowQRCode = () => {
        setShowQRCode(!showQRCode);
    };

    return (
        <div className="container mx-auto p-4 relative">
            <h1 className="text-2xl font-bold mb-4">คำร้องการยืมของคุณ</h1>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            <button
                onClick={handleShowQRCode}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center"
            >
                <QrCode className="mr-2" />
                {showQRCode ? 'รับการแจ้งเตือน' : 'รับการแจ้งเตือน'}
            </button>
            {showQRCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4">สแกน QR Code เพื่อรับการแจ้งเตือน</h2>
                        <Image src="/borrow.png" alt="QR Code" width={250} height={250} className="mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-4">สแกน QR Code นี้ด้วยแอปพลิเคชันของคุณเพื่อรับการแจ้งเตือนเกี่ยวกับการยืมอุปกรณ์</p>
                        <button
                            onClick={handleShowQRCode}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            )}
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
                                <th className="py-2 px-4 border-b"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanRequests.map((request: LoanRequest) => (
                                <tr key={request.transaction_id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center">{request.user_firstname}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.user_email}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.transaction_id}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {(() => {
                                            const { text, color } = getStatusDisplay(request.loan_status);
                                            return (
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
                                                    {text}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">{request.loan_date}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.due_date}</td>
                                    <td className="py-2 px-4 border-b text-center">{request.item_quantity}</td>
                                    <td className="py-3 px-4 flex items-center space-x-2">
                                        <button 
                                            onClick={() => handleViewDetails(request.user_id, request.transaction_id)} 
                                            className="text-blue-500 hover:text-blue-700 border-none"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(request.transaction_id)} 
                                            className="text-red-500 hover:text-red-700 border-none"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">ไม่มีคำร้องการยืมที่รอดำเนินการในขณะนี้</p>
            )}
        </div>
    );
}