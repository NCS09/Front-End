'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
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


export default function LoanDetailPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params  = useParams<{userId: string}>();
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingTransactionId, setConfirmingTransactionId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/admin/loan_detail`, {
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

    const handleConfirm = async (transaction_id: string, status: string) => {
        setConfirmingTransactionId(transaction_id);

        try {
            const response = await fetch(`${apiUrl}/admin/loan_detail/update`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ transaction_id, loan_status: status }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถยืนยันการยืมได้');
            }

            console.log('ยืนยันการยืมสำเร็จ');
            const updatedDetails = loanDetails.filter(detail => detail.transaction_id !== transaction_id);
            setLoanDetails(updatedDetails);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการยืนยัน:", error);
            setErrorMessage('ไม่สามารถยืนยันการยืมได้');
        } finally {
            setConfirmingTransactionId(null);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">คำขอทั้งหมด</h1>
            <div className="mb-6">
                <nav>
                    <ul className="flex space-x-4 border-b-2 border-gray-300">
                        <li>
                            <Link href={`/admin/${params.userId}/Requests` } className="inline-block py-2 px-4 text-blue-600 hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition">
                                ทั้งหมด
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/${params.userId}/Requests/pending` } className="inline-block py-2 px-4 text-blue-600 hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition">
                                รอยืนยัน
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/${params.userId}/Requests/Confirm`} className="inline-block py-2 px-4 text-blue-600 hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition">
                                ยืนยันแล้ว
                            </Link>
                        </li>
                        <li>
                            <Link href={`/admin/${params.userId}/Requests/deny`} className="inline-block py-2 px-4 text-blue-600 hover:text-blue-800 border-b-2 border-transparent hover:border-blue-600 transition">
                                ปฎิเสธ
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
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
                                                    detail.loan_status == 'approve' ? 'bg-green-100 text-green-800' :
                                                    detail.loan_status == 'pending' ? 'bg-yellow-100 text-yellow-800' :
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
        </div>
    );
}
