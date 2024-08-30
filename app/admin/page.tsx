'use client';

import React, { useEffect, useState } from "react";

interface LoanDetail {
    device_name: string;
    borrow_count: number;
}

interface DashboardData {
    total_users: number;
    total_devices: number;
    loan_details: LoanDetail[];
}


export default function Dashboardpage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/dashboard`, {
                    method: 'GET',
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result: DashboardData = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div>กำลังโหลด...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const loanDetails = data?.loan_details || [];
    const totalBorrowCount = loanDetails.reduce((acc, item) => acc + item.borrow_count, 0);

    return (
        <div className="flex h-screen w-full">
            <main className="w-full p-8 bg-blue-100 rounded-lg">
                <h1 className="text-2xl mb-4">Dashboard</h1>
                <div className="bg-slate-50 p-3 rounded-lg h-auto">
                    <div className="flex justify-between mb-8">
                        <div className="bg-green-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการอุปกรณ์<br /> {data?.total_devices || 0} รายการ
                        </div>
                        <div className="bg-blue-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            จำนวนสมาชิก<br />{data?.total_users || 0} คน
                        </div>
                        <div className="bg-red-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการยืม<br /> {totalBorrowCount} รายการ
                        </div>
                    </div>

                    <div className="mt-5">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">NO.</th>
                                    <th className="border border-gray-300 p-2">ชื่ออุปกรณ์</th>
                                    <th className="border border-gray-300 p-2">จำนวนการยืม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loanDetails.length > 0 ? (
                                    loanDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                            <td className="border border-gray-300 p-2">{item.device_name}</td>
                                            <td className="border border-gray-300 p-2 text-center">{item.borrow_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="border border-gray-300 p-2 text-center">
                                            ไม่มีข้อมูลอุปกรณ์
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
