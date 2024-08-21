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

export default function Returnpage() {
    const router = useRouter();
    const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<LoanDetail | null>(null);

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
            setIsLoading(false); // ซ่อน loading หลังดึงข้อมูลเสร็จ
            setShowModal(true); // เปิดท็อปอัพ
        }
    };

    const handleConfirmReturn = async () => {
        try {
            const response = await fetch('http://localhost:8000/return', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    items: requests.map(request => ({
                        item_id: request.item_id,
                        return_status: request.item_availability_status,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('ไม่สามารถยืนยันการคืนได้');
            }

            const result = await response.json();
            console.log(result.message);
            setShowModal(false);
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
                                                    className="text-green-500 hover:text-green-700"
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

                    {/* ท็อปอัพสำหรับยืนยันการคืน */}
                    {showModal && selectedLoan && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
                                <h2 className="text-lg font-semibold mb-4">ยืนยันการคืนสำหรับ: {selectedLoan.user_firstname}</h2>
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-4 border-b text-left text-gray-600">ชื่ออุปกรณ์</th>
                                            <th className="py-3 px-4 border-b text-left text-gray-600">หมายเลขซีเรียล</th>
                                            <th className="py-3 px-4 border-b text-left text-gray-600">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((item, index) => (
                                            <tr key={item.item_serial} className="hover:bg-gray-100">
                                                <td className="py-3 px-4 border-b">{item.item_name}</td>
                                                <td className="py-3 px-4 border-b">{item.item_serial}</td>
                                                <td className="py-3 px-4 border-b">
                                                    <select
                                                        value={item.item_availability_status}
                                                        onChange={(e) => handleChangeStatus(index, e.target.value)}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="complete">คืนแล้ว</option>
                                                        <option value="lost">หาย</option>
                                                        <option value="damaged">ชำรุด</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button 
                                        onClick={() => setShowModal(false)} 
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button 
                                        onClick={handleConfirmReturn} 
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        ยืนยันการคืน
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
