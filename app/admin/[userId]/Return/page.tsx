'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Eye, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

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
    item_id: string;
}

interface RequestItem {
    loan_id: string;
    item_name: string;
    item_id: string;
    item_serial: string;
    user_id: string;
    user_email: string;
    loan_date: string;
    due_date: string;
    item_availability_status: string;
}

const ITEMS_PER_PAGE = 20;

export default function ImprovedLoanDetailPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = useParams<{ userId: string }>();
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<LoanDetail | null>(null);
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/admin/loan_detail/borrowed`, {
                method: 'GET',
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลการยืมได้');
            }

            const result = await response.json();
            setLoanDetails(result);
            setErrorMessage('');
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูลการยืม');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = async (loan: LoanDetail) => {
        setSelectedLoan(loan);
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/admin/loan_detail/${loan.user_id}/${loan.transaction_id}`, {
                method: 'GET',
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
            }

            const result = await response.json();
            setRequests(result.requests);
            setErrorMessage('');
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setIsLoading(false);
            setShowModal(true);
        }
    };

    const handleChangeStatus = (index: number, status: string) => {
        const updatedRequests = [...requests];
        updatedRequests[index].item_availability_status = status;
        setRequests(updatedRequests);
        setStatusError(''); // ล้างข้อผิดพลาดเมื่อมีการเลือกสถานะ
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setFileName(file ? file.name : null);
    };

    const handleConfirmReturn = async () => {
        if (!selectedLoan) return;

        // ตรวจสอบว่าทุกรายการมีการเลือกสถานะที่ถูกต้อง
        const invalidStatuses = requests.filter(request => 
            !['returned', 'lost', 'damaged'].includes(request.item_availability_status)
        );

        if (invalidStatuses.length > 0) {
            setStatusError('กรุณาเลือกสถานะที่ถูกต้องสำหรับทุกรายการ');
            return;
        }

        const formData = new FormData();
        const items = requests.map(request => ({
            item_id: request.item_id,
            return_status: request.item_availability_status,
        }));

        formData.append('items', JSON.stringify(items));

        if (selectedFile) {
            formData.append('device_photo', selectedFile);
        }

        try {
            const response = await fetch(`${apiUrl}/return`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'ไม่สามารถยืนยันการคืนได้');
            }

            const result = await response.json();
            setSuccessMessage(result.message);
            setShowModal(false);
            fetchData(); // รีเฟรชข้อมูลหลังการคืนสำเร็จ
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการยืนยันการคืน:', error);
            
        }
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = loanDetails.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(loanDetails.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">คำขอยืมอุปกรณ์</h1>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
                    {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                    {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {['ชื่อผู้ใช้', 'อีเมล', 'วันที่ยืม', 'วันกำหนดคืน', 'จำนวน', 'สถานะ', 'การดำเนินการ'].map((header) => (
                                        <th key={header} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length === 0 ? (
                                    <tr><td colSpan={7} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลการยืม</td></tr>
                                ) : (
                                    currentItems.map((detail) => (
                                        <tr key={detail.loan_id} className="hover:bg-gray-50">
                                            <td className="py-4 px-4 whitespace-nowrap">{detail.user_firstname}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{detail.user_email}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{detail.loan_date}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{detail.due_date}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-center">{detail.item_quantity}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    detail.loan_status === 'approve' ? 'bg-green-100 text-green-800' :
                                                    detail.loan_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    detail.loan_status === 'complete' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {detail.loan_status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => handleViewDetails(detail)} 
                                                    className="text-blue-600 hover:text-blue-900">
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
            )}

            {showModal && selectedLoan && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-4">รายละเอียดการคืน</h2>
                        <p><strong>ผู้ใช้:</strong> {selectedLoan.user_firstname}</p>
                        <p><strong>อีเมล:</strong> {selectedLoan.user_email}</p>
                        <p><strong>วันที่ยืม:</strong> {selectedLoan.loan_date}</p>
                        <p><strong>กำหนดคืน:</strong> {selectedLoan.due_date}</p>
                        <p><strong>สถานะ:</strong> {selectedLoan.loan_status}</p>

                        <h3 className="text-xl font-semibold mt-6 mb-2">รายการอุปกรณ์</h3>
                        {statusError && <p className="text-red-500 mb-2">{statusError}</p>}
                        <table className="min-w-full bg-white border border-gray-300 mb-4">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">ชื่ออุปกรณ์</th>
                                    <th className="py-2 px-4 border-b text-left">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => (
                                    <tr key={request.item_id}>
                                        <td className="py-2 px-4 border-b">{request.item_name}</td>
                                        <td className="py-2 px-4 border-b">
                                            <select
                                                value={request.item_availability_status}
                                                onChange={(e) => handleChangeStatus(index, e.target.value)}
                                                className="border p-1 rounded"
                                            >
                                                <option value="">เลือกสถานะ</option>
                                                <option value="returned">คืนแล้ว</option>
                                                <option value="lost">สูญหาย</option>
                                                <option value="damaged">ชำรุด</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                อัพโหลดรูปภาพการคืน
                            </label>
                            <div className="mt-1 flex items-center">
                                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                    <Upload className="h-full w-full text-gray-300" />
                                </span>
                                <label
                                    htmlFor="file-upload"
                                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    เลือกรูปภาพ
                                </label>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </div>
                            {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            >
                                ปิด
                            </button>
                            <button
                                onClick={handleConfirmReturn}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
                            >
                                ยืนยันการคืน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}