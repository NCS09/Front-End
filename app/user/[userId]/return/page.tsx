'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function returndevice() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [returndevices, setreturnDevices] = useState([]);
    const [errormessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/`, {
                method: 'GET',
                credentials: "include",

            });
    
            const result = await response.json();
            setreturnDevices(result);
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
            รอคืน
        </div>
    )


}