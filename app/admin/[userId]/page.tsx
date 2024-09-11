'use client';

import React, { useEffect, useState } from "react";

interface TopDevice {
    item_name: string;
    borrow_count: number;
}

interface DashboardData {
    total_users: number;
    total_devices: number;
    total_transactions: number;
    top_devices: TopDevice[];
}

export default function Dashboardpage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false); // state สำหรับควบคุมการแสดง Modal

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
        };
        fetchData();
    }, []);

    const downloadReport = async () => {
        try {
            const response = await fetch(`${apiUrl}/report/download`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            // แปลงข้อมูลที่ได้มาเป็น blob เพื่อสร้าง URL สำหรับดาวน์โหลดไฟล์
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // สร้างชื่อไฟล์ตามวันที่ปัจจุบัน
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                .toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

            // สร้างลิงก์ชั่วคราวเพื่อดาวน์โหลดไฟล์ พร้อมตั้งชื่อไฟล์ตามวันที่
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `รายงานวันที่ ${formattedDate}.csv`); // ตั้งชื่อไฟล์ที่ได้ตามวันที่
            document.body.appendChild(link);
            link.click();

            // ลบลิงก์ชั่วคราวหลังดาวน์โหลดเสร็จ
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    const handleDownloadClick = () => {
        setShowModal(true);
    };
    const confirmDownload = () => {
        downloadReport();
        setShowModal(false);
    };
    const cancelDownload = () => {
        setShowModal(false); 
    };

    if (loading) {
        return <div>กำลังโหลด...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const topDevices = data?.top_devices || [];

    return (
        <div className="flex h-screen w-full">
            <main className="w-full p-8 bg-blue-100 rounded-lg">
                <h1 className="text-2xl mb-4">Dashboard</h1>

                {/* ปุ่มออกรายงาน */}
                <div className="mb-4">
                    <button onClick={handleDownloadClick} className="bg-green-500 text-white p-2 rounded-lg">
                        ออกรายงาน
                    </button>
                </div>

                {/* Modal ยืนยันการดาวน์โหลด */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl mb-4">ยืนยันการดาวน์โหลด</h2>
                            <p className="mb-6">คุณต้องการดาวน์โหลดรายงานใช่หรือไม่?</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={cancelDownload}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-4"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={confirmDownload}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                >
                                    ดาวน์โหลด
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-slate-50 p-3 rounded-lg h-auto">
                    <div className="flex justify-between mb-8">
                        <div className="bg-green-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการอุปกรณ์<br /> {data?.total_devices || 0} รายการ
                        </div>
                        <div className="bg-blue-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            จำนวนสมาชิก<br />{data?.total_users || 0} คน
                        </div>
                        <div className="bg-red-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการยืม<br /> {data?.total_transactions || 0} รายการ
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
                                {topDevices.length > 0 ? (
                                    topDevices.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                            <td className="border border-gray-300 p-2">{item.item_name}</td>
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
