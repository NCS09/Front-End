'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Eye, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface LoanDetail {
  loan_id: number;
  user_firstname: string;
  user_email: string;
  loan_date: string;
  due_date: string;
  item_quantity: number;
  loan_status: 'approve' | 'pending' | 'rejected' | 'borrowed';
  transaction_id: number;
  user_id: number;
}

const statusDisplay: { [key: string]: { text: string; color: string } } = {
  approve: { text: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-800' },
  pending: { text: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800' },
  deny: { text: 'ปฏิเสธ', color: 'bg-red-100 text-red-800' },
  borrowed: { text: 'กำลังยืม', color: 'bg-blue-100 text-blue-800' },
};

const getStatusDisplay = (status: string) => {
  return statusDisplay[status] || { text: 'ไม่ทราบสถานะ', color: 'bg-gray-100 text-gray-800' };
};

export default function ConfirmDevice() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { userId } = useParams<{ userId: string }>();
  const [confirmreq, setConfirmreq] = useState<LoanDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiUrl}/loan_detail/approve/${userId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลจาก API ได้');
      }

      const result: LoanDetail[] = await response.json();
      setConfirmreq(result);
      setTotalPages(Math.ceil(result.length / itemsPerPage));
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = confirmreq.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewDetails = (user_id: string, transaction_id: string) => {
    router.push(`/user/${user_id}/return/${user_id}/${transaction_id}`);
  };

  const handleConfirm = async (transaction_id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiUrl}/confirm-loan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ transaction_id }),
        
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถยืนยันการยืมได้');
      }

      console.log('ยืนยันการยืมสำเร็จ');
      setConfirmreq(confirmreq.filter(detail => detail.transaction_id !== transaction_id));
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการยืนยัน:', error);
      setErrorMessage('ไม่สามารถยืนยันการยืมได้');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">ยืนยันรับอุปกรณ์</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
          {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  {['ชื่อผู้ใช้', 'อีเมล', 'วันที่ยืม', 'กำหนดคืน', 'จำนวน', 'สถานะ', 'การดำเนินการ'].map((header) => (
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
                        {(() => {
                          const { text, color } = getStatusDisplay(detail.loan_status);
                          return (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
                              {text}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleViewDetails(detail.user_id.toString(), detail.transaction_id.toString())} 
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-md flex items-center transition duration-300"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            <span>ดู</span>
                          </button>
                          <button
                            onClick={() => handleConfirm(detail.transaction_id)}
                            className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded-md flex items-center transition duration-300"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span>ยืนยัน</span>
                          </button>
                        </div>
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
    </div>
  );
}