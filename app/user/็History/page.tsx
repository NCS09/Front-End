'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Eye, X } from 'lucide-react';

export default function DeviceRequests() {
    const [loanRequests, setLoanRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8000/user/", {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
    
            const result = await response.json();
            setLoanRequests(result);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            setErrorMessage('ไม่สามารถดึงข้อมูลการยืมได้');
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);


}