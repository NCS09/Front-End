'use client'

import React, { useEffect, useState } from "react";

// Define the type for the data structure you are fetching
interface DashboardData {
    total_users: number;
    total_loans: number;
    total_devices: number;
    device_name: string;
    borrow_count: number;
}

export default function Dashboardpage() {
    const [data, setData] = useState<DashboardData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/dashboard", {
                    method: 'GET',
                    credentials: "include",
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="flex h-screen w-full">
            <main className="w-full p-8 bg-blue-100 rounded-lg">
                <h1 className="text-2xl mb-4">Dashboard</h1>
                <div className="bg-slate-50 p-3 rounded-lg h-auto">
                    <div className="flex justify-between mb-8">
                        <div className="bg-green-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการอุปกรณ์<br /> {data[0]?.total_devices} รายการ
                        </div>
                        <div className="bg-blue-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            จำนวนสมาชิก<br />{data[0]?.total_users} คน
                        </div>
                        <div className="bg-red-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการยืม<br /> {data[0]?.borrow_count} รายการ
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
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{item.device_name}</td>
                                        <td className="border border-gray-300 p-2 text-center">{item.borrow_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
