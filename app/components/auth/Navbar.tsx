'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // ตรวจสอบสถานะการล็อกอินจาก localStorage
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token); // ถ้ามี token จะเป็น true
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/logout", {
                method: 'POST',
                credentials: 'include',
            });

            const result = await response.json();
            if (result.type === 'ok') {
                localStorage.removeItem('authToken');
                setIsLoggedIn(false);
                router.refresh(); // รีเฟรชหน้า
                router.push('/Login'); // ไปยังหน้าเข้าสู่ระบบ
            } else {
                console.error('Logout failed:', result.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-blue-950 p-3">
            <div className="flex mx-3 justify-between text-white text-md font-bold">
                <Link href="/">โลโก้</Link>
                <div>
                    {!isLoggedIn ? (
                        <>
                            <Link href="/Login" className="pr-4 hover:text-blue-500">เข้าสู่ระบบ</Link>
                            <Link href="/Register" className="hover:text-blue-500">สมัครสมาชิก</Link>
                        </>
                    ) : (
                        <button 
                            onClick={handleLogout} 
                            className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            ออกจากระบบ
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
