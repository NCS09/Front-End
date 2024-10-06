'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, BarChart2, Users, Package } from 'lucide-react';

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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedReportType, setSelectedReportType] = useState<string>('');

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
        if (!selectedReportType) {
            alert('กรุณาเลือกประเภทรายงาน');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/report/download/${selectedReportType}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                .toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

            let reportTypeName = '';
            switch (selectedReportType) {
                case 'loan-return':
                    reportTypeName = 'รายงานประวัติการยืม-คืนอุปกรณ์ทั้งหมด';
                    break;
                case 'status':
                    reportTypeName = 'รายงานสถานะอุปกรณ์ทั้งหมด';
                    break;
                case 'device-type':
                    reportTypeName = 'รายงานข้อมูลอุปกรณ์ทั้งหมดในห้องปฏิบัติการ';
                    break;
                default:
                    reportTypeName = 'รายงาน';
            }

            const fileName = `${reportTypeName}_${formattedDate}.xlsx`;

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('เกิดข้อผิดพลาดในการดาวน์โหลดรายงาน');
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
        setSelectedReportType('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        );
    }

    const topDevices = data?.top_devices || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <motion.h1 
                    className="text-4xl font-bold mb-8 text-blue-600"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    แดชบอร์ด
                </motion.h1>

                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <button 
                        onClick={handleDownloadClick} 
                        className="inline-flex items-center bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors text-lg"
                    >
                        <Download className="mr-2 h-5 w-5" />
                        ออกรายงาน
                    </button>
                </motion.div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 text-blue-600">เลือกประเภทรายงาน</h2>
                            <select
                                value={selectedReportType}
                                onChange={(e) => setSelectedReportType(e.target.value)}
                                className="w-full p-2 mb-4 border border-gray-300 rounded"
                            >
                                <option value="">เลือกประเภทรายงาน</option>
                                <option value="loan-return">รายงานประวัติการยืม-คืนอุปกรณ์ทั้งหมด</option>
                                <option value="status">รายงานสถานะอุปกรณ์ทั้งหมด</option>
                                <option value="device-type">รายงานข้อมูลอุปกรณ์ทั้งหมดในห้องปฏิบัติการ</option>
                            </select>
                            <div className="flex justify-end">
                                <button
                                    onClick={cancelDownload}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full mr-4"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={confirmDownload}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                                    disabled={!selectedReportType}
                                >
                                    ดาวน์โหลด
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: Package, title: "รายการอุปกรณ์", value: data?.total_devices || 0, color: "from-blue-400 to-blue-600" },
                        { icon: Users, title: "จำนวนสมาชิก", value: data?.total_users || 0, color: "from-green-400 to-green-600" },
                        { icon: BarChart2, title: "รายการยืม", value: data?.total_transactions || 0, color: "from-yellow-400 to-yellow-600" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className={`bg-gradient-to-r ${item.color} p-6 rounded-xl shadow-lg text-white`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{item.title}</h2>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <p className="text-3xl font-bold">{item.value}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="bg-white rounded-xl shadow-lg p-6 overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-blue-600">อุปกรณ์ยอดนิยม</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="border-b-2 border-blue-200 px-4 py-2 text-left text-blue-600">ลำดับ</th>
                                    <th className="border-b-2 border-blue-200 px-4 py-2 text-left text-blue-600">ชื่ออุปกรณ์</th>
                                    <th className="border-b-2 border-blue-200 px-4 py-2 text-left text-blue-600">จำนวนการยืม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topDevices.length > 0 ? (
                                    topDevices.slice(0, 5).map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="border-b border-gray-200 px-4 py-2">{index + 1}</td>
                                            <td className="border-b border-gray-200 px-4 py-2">{item.item_name}</td>
                                            <td className="border-b border-gray-200 px-4 py-2">{item.borrow_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="border-b border-gray-200 px-4 py-2 text-center text-gray-500">
                                            ไม่มีข้อมูลอุปกรณ์
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}