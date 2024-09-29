'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText } from 'lucide-react';

interface User {
    user_id: string;
    user_firstname: string;
    user_lastname: string;
    user_email: string;
    user_role: string;
    user_phone: string;
}

interface ReportData {
    item_name: string;
    item_serial: string;
    loan_date: string;
    return_date: string;
    return_status: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [deviceType, setDeviceType] = useState<string>('');
    const [loanDate, setLoanDate] = useState<string>('');
    const [reportData, setReportData] = useState<ReportData[] | null>(null);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/list-user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
            setLoading(false);
        }
    };

    const filterUsers = () => {
        const filtered = users.filter(user => 
            (user.user_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (user.user_firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (user.user_lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) || 
            (user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
        setFilteredUsers(filtered);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFetchReport = async () => {
        if (!selectedUser || !deviceType || !loanDate) {
            alert('กรุณาเลือกผู้ใช้ ประเภทอุปกรณ์ และวันที่ยืม');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/fetch-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: selectedUser,
                    device_type: deviceType,
                    loan_date: loanDate
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 404) {
                    alert('ไม่พบข้อมูลการยืม-คืน');
                    setReportData(null);
                } else {
                    throw new Error('Failed to fetch report data');
                }
            } else {
                const data = await response.json();
                setReportData(data);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            alert('เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน');
        }
    };

    const handleGenerateReport = async () => {
        if (!selectedUser || !deviceType || !loanDate) {
            alert('กรุณาเลือกผู้ใช้ ประเภทอุปกรณ์ และวันที่ยืม');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/generate-report?user_id=${selectedUser}&device_type=${deviceType}&loan_date=${loanDate}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `ใบยืม-คืน-${deviceType}-ID-${selectedUser}-${loanDate}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Failed to generate report');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert('เกิดข้อผิดพลาดในการสร้างรายงาน');
        }
    };

    if (loading) {
        return <div className="text-center py-10">กำลังโหลด...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">รายชื่อผู้ใช้</h1>
            <div className="mb-4 flex items-center">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">นามสกุล</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.user_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.user_firstname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.user_lastname}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.user_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.user_role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {user.user_role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.user_phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => setSelectedUser(user.user_id)}
                                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                    >
                                        <FileText size={16} className="mr-1" />
                                        ดูรายงาน
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">ดูรายงาน</h3>
                            <div className="mt-2 px-7 py-3">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deviceType">
                                        ประเภทอุปกรณ์
                                    </label>
                                    <select
                                        id="deviceType"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={deviceType}
                                        onChange={(e) => setDeviceType(e.target.value)}
                                    >
                                        <option value="">เลือกประเภทอุปกรณ์</option>
                                        <option value="ครุภัณฑ์ประจำห้องปฏิบัติการ">ครุภัณฑ์ประจำห้องปฏิบัติการ</option>
                                        <option value="วัสดุคงทนถาวรประจำห้องปฏิบัติการ">วัสดุคงทนถาวรประจำห้องปฏิบัติการ</option>
                                        <option value="วัสดุสิ้นเปลืองประจำห้องปฏิบัติการ">วัสดุสิ้นเปลืองประจำห้องปฏิบัติการ</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loanDate">
                                        วันที่ยืม
                                    </label>
                                    <input
                                        type="date"
                                        id="loanDate"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={loanDate}
                                        onChange={(e) => setLoanDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleFetchReport}
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    ดูข้อมูลรายงาน
                                </button>
                            </div>
                            {reportData && reportData.length > 0 && (
                                <div className="items-center px-4 py-3">
                                    <button
                                        onClick={handleGenerateReport}
                                        className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                    >
                                        สร้างรายงาน PDF
                                    </button>
                                </div>
                            )}
                           <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setReportData(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {reportData && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">ข้อมูลรายงาน</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ชื่ออุปกรณ์</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">หมายเลขซีเรียล</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">วันที่ยืม</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">วันที่คืน</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">{item.item_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">{item.item_serial}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">{new Date(item.loan_date).toLocaleDateString('th-TH')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                        {item.return_date ? new Date(item.return_date).toLocaleDateString('th-TH') : 'ยังไม่คืน'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                        {(() => {
                                            switch (item.return_status) {
                                                case 'returned':
                                                    return 'คืนแล้ว';
                                                case 'lost':
                                                    return 'สูญหาย';
                                                case 'damaged':
                                                    return 'ชำรุด';
                                                case 'cancel':
                                                    return 'ถูกยกเลิก';
                                                case 'deny':
                                                    return 'ปฏิเสธ';
                                                default:
                                                    return 'ไม่ระบุ';
                                            }
                                        })()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;