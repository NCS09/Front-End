'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';

interface LoanDetail {
    return_id: string | null;
    item_name: string;
    item_serial: string;
    user_id: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    return_date: string | null;
    status: string;
    item_id: string | null;
    device_photo: string | null;
}

const ITEMS_PER_PAGE = 20;

export default function LoanDetailPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams<{id: string, idt: string}>();
    const router = useRouter(); 
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id || !params.idt) {
                setErrorMessage('ไม่พบข้อมูล user_id หรือ transaction_id');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/user/history/${params.id}/${params.idt}`, {
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

    const getStatusColor = (status: string | null | undefined) => {
        if (!status) return 'bg-gray-100 text-gray-800';
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
                return status;
        }
    };

    const openImageModal = (imageUrl: string | null) => {
        if (imageUrl) {
            setSelectedImage(imageUrl);
        }
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <button 
                className="mb-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
                onClick={() => router.back()}
            >
                ย้อนกลับ
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">รายละเอียดการยืม</h1>

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
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูปภาพ</th>
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
                                                <td colSpan={8} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td>
                                            </tr>
                                        ) : (
                                            currentItems.map((detail) => (
                                                <tr key={detail.return_id || detail.item_id} className="hover:bg-gray-50">
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        {detail.device_photo ? (
                                                            <button 
                                                                onClick={() => openImageModal(detail.device_photo)}
                                                                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                                                            >
                                                                <ImageIcon size={24} />
                                                            </button>
                                                        ) : (
                                                            <span>ไม่มีรูป</span>
                                                        )}
                                                    </td>
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

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-end mb-2">
                            <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <Image 
                            src={selectedImage} 
                            alt="Device" 
                            width={800} 
                            height={600} 
                            className="object-contain w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}