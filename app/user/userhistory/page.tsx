'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Eye, X } from 'lucide-react';

export default function DeviceRequests() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [loanRequests, setLoanRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/user`, {
                method: 'GET',
                credentials: "include",

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

    return(
        <div>
            ประวัติทั้งหมด
        </div>
    )

}