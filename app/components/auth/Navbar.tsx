'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
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
                router.refresh(); 
                router.push('/Login');
            } else {
                console.error('Logout failed:', result.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-white text-xl font-bold">
                            <Image src="/logo.svg" alt="Elec@UP Logo" width={100} height={30} />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="/Login" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200">
                                        <LogIn className="w-5 h-5 mr-1" />
                                        <span>เข้าสู่ระบบ</span>
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="/Register" className="flex items-center text-white hover:text-blue-200 transition-colors duration-200">
                                        <UserPlus className="w-5 h-5 mr-1" />
                                        <span>สมัครสมาชิก</span>
                                    </Link>
                                </motion.div>
                            </>
                        ) : (
                            <motion.button 
                                onClick={handleLogout} 
                                className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                            >
                                ออกจากระบบ
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
