'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Check } from 'lucide-react';
import QRCode from 'qrcode.react'; // หรือ import { QRCode } from 'react-qr-code';

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [showQRCode, setShowQRCode] = useState(false);

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
                body: formData,
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
    const handleCloseModal = () => {
        setShowModal(false);
        fetchData(); // ทำการ fetch ข้อมูลใหม่หลังจากปิด Modal
    };

    // สร้าง URL สำหรับ QR Code
    const generateQRCodeURL = () => {
        const items = requests.map(request => ({
            item_id: request.item_id,
            return_status: request.item_availability_status,
            user_id: request.user_id,
        }));
        const itemsString = encodeURIComponent(JSON.stringify(items));
        return `https://b701-2403-6200-8853-18fa-784b-458a-2f20-7664.ngrok-free.app/return-data?data=${itemsString}`;
        
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
                                                    className="flex items-center justify-center p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
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
                    
                    {showModal && selectedLoan && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                                <h2 className="text-xl font-semibold mb-4">รายละเอียดการคืนอุปกรณ์</h2>
                                {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                                <table className="min-w-full bg-white border border-gray-300 mb-4">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-gray-600">ชื่ออุปกรณ์</th>
                                            <th className="py-3 px-4 border-b text-left text-gray-600">หมายเลขซีเรียล</th>
                                            <th className="py-3 px-4 border-b text-left text-gray-600">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                                            </tr>
                                        ) : requests.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">ไม่พบข้อมูลอุปกรณ์</td>
                                            </tr>
                                        ) : (
                                            requests.map((request, index) => (
                                                <tr key={request.item_id}>
                                                    <td className="py-3 px-4 border-b">{request.item_name}</td>
                                                    <td className="py-3 px-4 border-b">{request.item_serial}</td>
                                                    <td className="py-3 px-4 border-b">
                                                        <select
                                                            value={request.item_availability_status}
                                                            onChange={(e) => handleChangeStatus(index, e.target.value)}
                                                            className="form-select"
                                                        >
                                                            <option value="returned">Returned</option>
                                                            <option value="lost">Lost</option>
                                                            <option value="damaged">Damaged</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">เลือกรูปภาพ</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {fileName && <p className="mt-2 text-sm text-gray-500">เลือกไฟล์: {fileName}</p>}
                                </div>

                                {/* Show QR Code */}
                                {showQRCode && (
                                    <div className="mb-4 text-center">
                                        <QRCode value={generateQRCodeURL()} />
                                        <p className="mt-2 text-sm text-gray-500">สแกน QR Code เพื่อยืนยันการคืน</p>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <button 
                                        onClick={handleConfirmReturn} 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        ยืนยันการคืน
                                    </button>
                                    <button 
                                        onClick={handleCloseModal}  
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        ปิด
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setShowQRCode(!showQRCode)} 
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                                >
                                    {showQRCode ? 'ซ่อน QR Code' : 'แสดง QR Code'}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
