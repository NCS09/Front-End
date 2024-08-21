'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { Eye, Check, X } from 'lucide-react'; 

interface LoanDetail {
    loan_id: string;
    user_firstname: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    item_quantity: string;
    user_id: string;
    transaction_id: string;
    loan_status: string;
}

interface items {
    item_id: string;
    return_status: string;
}

export default function Returnpage() {
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [items, setItems] = useState<items[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/admin/loan_detail/approve", {
                    method: 'GET',
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
                }

                const result = await response.json();
                setLoanDetails(result);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleViewDetails = (user_id: string, transaction_id: string) => {
        router.push(`/admin/Requests/${user_id}/${transaction_id}`);
    };

   const handleConfirmReturn = async (items: { item_id: string, return_status: string }[], devicePhoto: File | null) => {
    const formData = new FormData();
    formData.append('items', JSON.stringify(items));
    if (devicePhoto) {
        formData.append('device_photo', devicePhoto);
    }

    try {
        const response = await fetch("http://localhost:8000/return", {
            method: 'POST',
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error('ไม่สามารถยืนยันการคืนได้');
        }

        const result = await response.json();
        alert(result.message);
        router.push('/success');  // นำผู้ใช้ไปที่หน้าที่แสดงผลสำเร็จ
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        setErrorMessage('เกิดข้อผิดพลาดในการคืนอุปกรณ์');
    }
};



    return (
        <>
            {isLoading ? (
                <p className="text-center">กำลังโหลดข้อมูล...</p>
            ) : (
                <>
                    {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 border-b text-left text-gray-600">ชื่อผู้ใช้</th>
                                    <th className="py-3 px-4 border-b text-left text-gray-600">อีเมล</th>
                                    <th className="py-3 px-4 border-b text-left text-gray-600">วันที่ยืม</th>
                                    <th className="py-3 px-4 border-b text-left text-gray-600">กำหนดคืน</th>
                                    <th className="py-3 px-4 border-b text-left text-gray-600">จำนวน</th>
                                    <th className="py-3 px-4 border-b text-left text-gray-600">สถานะ</th>
                                    <th className="py-3 px-4 border-b text-left text-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loanDetails.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td>
                                    </tr>
                                ) : (
                                    loanDetails.map((detail) => (
                                        <tr key={detail.loan_id} className="hover:bg-gray-100">
                                            <td className="py-3 px-4 border-b">{detail.user_firstname}</td>
                                            <td className="py-3 px-4 border-b">{detail.user_email}</td>
                                            <td className="py-3 px-4 border-b">{detail.loan_date}</td>
                                            <td className="py-3 px-4 border-b">{detail.due_date}</td>
                                            <td className="py-3 px-4 border-b text-center">{detail.item_quantity}</td>
                                            <td className="py-3 px-4 border-b text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    detail.loan_status === 'approve' ? 'bg-green-100 text-green-800' :
                                                    detail.loan_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {detail.loan_status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 border-b flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleViewDetails(detail.user_id, detail.transaction_id)} 
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    );
}
