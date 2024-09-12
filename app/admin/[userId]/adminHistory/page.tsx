'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface LoanHistory {
    user_id: number;
    transaction_id: number;
    user_firstname: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    return_date: string;
    item_quantity: number;
    return_status: 'complete';
}

export default function HistoryPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { userId } = useParams<{ userId: string }>();
    const [loanHistory, setLoanHistory] = useState<LoanHistory[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const router = useRouter();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/admin/history`, {
                method: 'GET',
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('การตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง');
            }
            
            const result: LoanHistory[] = await response.json();
            if (result.length === 0) {
                setErrorMessage('ไม่พบข้อมูลประวัติการคืนที่เสร็จสมบูรณ์');
            } else {
                setLoanHistory(result);
                setErrorMessage('');
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลประวัติได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = loanHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(loanHistory.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">ประวัติการคืนอุปกรณ์</h1>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : errorMessage ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">ขออภัย! </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {['ชื่อผู้ใช้', 'อีเมล', 'วันที่ยืม', 'กำหนดคืน', 'วันที่คืน', 'จำนวน', 'สถานะการคืน', ''].map((header) => (
                                        <th key={header} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((item) => (
                                    <tr key={item.transaction_id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 whitespace-nowrap">{item.user_firstname}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{item.user_email}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{new Date(item.loan_date).toLocaleDateString('th-TH')}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{new Date(item.due_date).toLocaleDateString('th-TH')}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{new Date(item.return_date).toLocaleDateString('th-TH')}</td>
                                        <td className="py-4 px-4 whitespace-nowrap text-center">{item.item_quantity}</td>
                                        <td className="py-4 px-4 whitespace-nowrap text-center">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                คืนแล้ว
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => router.push(`/admin/${userId}/Requests/${item.user_id}/${item.transaction_id}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loanHistory.length > itemsPerPage && (
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-gray-700">
                                หน้า {currentPage} จาก {totalPages}
                            </span>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}