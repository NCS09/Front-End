'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import Dashboard from "../user/Productss/page";

// Define the type for the data structure you are fetching
interface User {
    id: number;
    Username: string;
    object: number;
}

export default function Dashboardpage() {
    const [data, setData] = useState<User[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch("https://6693424fc6be000fa07a61f5.mockapi.io/todo/v1/User");
            const result = await response.json();
            setData(result); // Ensure result matches the User[] type
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Sort data by object in descending order
    const sortedData = data.sort((a, b) => b.object - a.object);

    // Get unique IDs
    const uniqueIds = new Set(data.map(item => item.id));
    const uniqueIdCount = uniqueIds.size;

    return (
        <div className="flex h-screen w-full">
            <main className="w-full p-8 bg-blue-100 rounded-lg">
                <h1 className="text-2xl mb-4">Dashboard</h1>
                <div className="bg-slate-50 p-3 rounded-lg h-auto">
                    <div className="flex justify-between mb-8">
                        <div className="bg-green-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการอุปกรณ์<br /> รายการ
                        </div>
                        <div className="bg-blue-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            จำนวนสมาชิก<br />{uniqueIdCount} คน
                        </div>
                        <div className="bg-red-400 p-4 mx-3 rounded-lg w-1/3 text-center">
                            รายการยืม<br /> รายการ
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
                                {sortedData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{item.Username}</td>
                                        <td className="border border-gray-300 p-2 text-center">{item.object}</td>
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
