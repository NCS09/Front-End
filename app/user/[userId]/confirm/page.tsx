'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function confirmdevice() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [confirmreq, setConfirmreq] = useState([]);
    const [errormessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/`, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
    
            const result = await response.json();
            setConfirmreq(result);
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
            รอรับของ
        </div>
    )
}