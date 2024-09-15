'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LoanDetail {
    return_id: string;
    item_name: string;
    item_serial: string;
    user_id: string;
    user_email: string;
    loan_date: string;
    due_date: string | null;
    return_date: string | null;
    status: string;
    item_id: string;
}

const ITEMS_PER_PAGE = 20;

export default function AdminLoanDetailPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams<{id: string, idt: string}>();
    const router = useRouter(); 
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id || !params.idt) {
                setErrorMessage('ไม่พบข้อมูล user_id หรือ transaction_id');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/admin/history/${params.id}/${params.idt}`, {
                    method: 'GET',
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setErrorMessage('อุปกรณ์กำลังอยู่ในกระบวนการถูกยืม');
                    } else {
                        throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
                    }
                } else {
                    const result = await response.json();
                    setLoanDetails(result);
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
                setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.id, params.idt, apiUrl]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = loanDetails.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(loanDetails.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'lost':
                return 'bg-red-100 text-red-800';
            case 'damaged':
                return 'bg-orange-100 text-orange-800';
            case 'deny':
                return 'bg-red-100 text-red-800';
            case 'cancel':
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'returned':
                return 'คืนแล้ว';
            case 'pending':
                return 'รอคืน';
            case 'lost':
                return 'สูญหาย';
            case 'damaged':
                return 'ชำรุด';
            case 'deny':
                return 'ปฏิเสธ';
            case 'cancel':
                return 'ยกเลิก';
            default:
                return 'ไม่ทราบสถานะ';
        }
    };

    return (
        <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <button 
                className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
                onClick={() => router.back()}
            >
                ย้อนกลับ
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">รายละเอียดการยืมอุปกรณ์</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {errorMessage ? (
                        <p className="text-red-600 mb-4 text-center">{errorMessage}</p>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่ออุปกรณ์</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสอุปกรณ์</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมลผู้ใช้</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ยืม</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">กำหนดคืน</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่คืน</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะการคืน</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td>
                                            </tr>
                                        ) : (
                                            currentItems.map((detail) => (
                                                <tr key={detail.return_id} className="hover:bg-gray-50">
                                                    <td className="py-4 px-4 whitespace-nowrap">{detail.item_name}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">{detail.item_serial}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">{detail.user_email}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">{formatDate(detail.loan_date)}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">{formatDate(detail.due_date)}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">{formatDate(detail.return_date)}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(detail.status)}`}>
                                                            {getStatusText(detail.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {loanDetails.length > ITEMS_PER_PAGE && (
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
                </>
            )}
        </div>
    );
}