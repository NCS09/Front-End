'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

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
    user_phone: string;
}

const ITEMS_PER_PAGE = 20;

export default function ConfirmPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams<{ userId: string }>();
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/admin/loan_detail/approve`, {
                    method: 'GET',
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
                }

                const result = await response.json();
                setLoanDetails(result);
                setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleViewDetails = (userId: string, transactionId: string) => {
        router.push(`/user/${userId}/transaction/${transactionId}`);
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = loanDetails.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                    <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อผู้ใช้</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์ติดต่อ</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ยืม</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กำหนดคืน</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td>
                                        </tr>
                                    ) : (
                                        currentItems.map((detail) => (
                                            <tr key={detail.loan_id} className="hover:bg-gray-50">
                                                <td className="py-4 px-4 whitespace-nowrap">{detail.user_firstname}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{detail.user_email}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{detail.user_phone}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{detail.loan_date}</td>
                                                <td className="py-4 px-4 whitespace-nowrap">{detail.due_date}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-center">{detail.item_quantity}</td>
                                                <td className="py-4 px-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        detail.loan_status === 'approve' ? 'bg-green-100 text-green-800' :
                                                        detail.loan_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {detail.loan_status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewDetails(detail.user_id, detail.transaction_id)}
                                                        className="text-blue-600 hover:text-blue-900"
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
                    </div>
                </>
            )}
        </div>
    );
}
