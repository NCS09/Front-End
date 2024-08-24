'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Check } from 'lucide-react';

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

interface RequestsResponse {
    user_id: string;
    transaction_id: string;
    requests: RequestItem[];
}

export default function ReturnPage() {
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<LoanDetail | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // เก็บไฟล์ที่อัปโหลด
    const [fileName, setFileName] = useState<string | null>(null); // เก็บชื่อไฟล์

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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleViewDetails = (user_id: string, transaction_id: string) => {
        router.push(`/admin/Requests/${user_id}/${transaction_id}`);
    };

    const handleOpenModal = async (loan: LoanDetail, user_id: string, transaction_id: string) => {
        setSelectedLoan(loan);
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/admin/loan_detail/${user_id}/${transaction_id}`, {
                method: 'GET',
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
            }

            const result: RequestsResponse = await response.json();
            setRequests(result.requests);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลอุปกรณ์ได้');
        } finally {
            setIsLoading(false); 
            setShowModal(true);
        }
    };

    const handleConfirmReturn = async () => {
        const formData = new FormData();

        // สร้างข้อมูล JSON สำหรับ items
        const items = requests.map(request => ({
            item_id: request.item_id,
            return_status: request.item_availability_status,
        }));

        formData.append('items', JSON.stringify(items));

        // เพิ่มการส่งรูปภาพที่อัปโหลด (เพียงรูปเดียว)
        if (selectedFile) {
            formData.append('device_photo', selectedFile);
        }

        try {
            const response = await fetch('http://localhost:8000/return', {
                method: 'POST',
                credentials: 'include',
                body: formData, // ส่ง formData แทน JSON ธรรมดา
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถยืนยันการคืนได้');
            }

            const result = await response.json();
            console.log(result.message);
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการยืนยันการคืน:', error);
            setErrorMessage('ไม่สามารถยืนยันการคืนได้');
        }
    };

    const handleChangeStatus = (index: number, status: string) => {
        const updatedRequests = [...requests];
        updatedRequests[index].item_availability_status = status;
        setRequests(updatedRequests);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);

        if (file) {
            setFileName(file.name);
        } else {
            setFileName(null);
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
                                                <button 
                                                    onClick={() => handleOpenModal(detail, detail.user_id, detail.transaction_id)} 
                                                    className="flex items-center justify-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-md shadow-lg">
                                <h2 className="text-lg font-bold mb-4">รายละเอียดการคืนอุปกรณ์</h2>
                                {requests.length === 0 ? (
                                    <p className="text-gray-500">ไม่มีอุปกรณ์ในรายการ</p>
                                ) : (
                                    requests.map((request, index) => (
                                        <div key={index} className="flex justify-between items-center mb-4 p-4 border border-gray-200 rounded-md">
                                            <div>
                                                <p className="text-gray-800">{request.item_name}</p>
                                                <p className="text-gray-600">หมายเลขอุปกรณ์: {request.item_serial}</p>
                                            </div>
                                            <div>
                                                <select
                                                    value={request.item_availability_status}
                                                    onChange={(e) => handleChangeStatus(index, e.target.value)}
                                                    className="border border-gray-300 rounded-md px-3 py-2"
                                                >
                                                    <option value="returned">คืนแล้ว</option>
                                                    <option value="lost">สูญหาย</option>
                                                    <option value="damaged">เสียหาย</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <div className="mt-4">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="mb-4"
                                        accept="image/*"
                                    />
                                    {fileName && (
                                        <div className="mb-4">
                                            <p className="text-gray-800">ไฟล์ที่เลือก: {fileName}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleConfirmReturn} 
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                                        >
                                            ยืนยันการคืน
                                        </button>
                                        <button 
                                            onClick={() => setShowModal(false)} 
                                            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
                                        >
                                            ปิด
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
