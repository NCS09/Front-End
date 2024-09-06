'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';
import Navbar from './navbars';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('error');
    const [userId, setUserId] = useState<number | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = { email, password };

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include", 
            });

            const result = await response.json();
            if (result.type === 'ok') {
                setMessageType('success');
                setMessage('เข้าสู่ระบบสำเร็จ!');
                setUserId(result.user_id);

                localStorage.setItem('userId', result.user_id.toString());

                if (result.role === 2) {
                    localStorage.setItem('authToken', 'Admin');
                    router.push(`/admin/${userId}`);
                } else {
                    localStorage.setItem('authToken', 'User');
                    router.push(`/user/${userId}`); 
                }
            } else {
                setMessageType('error');
                setMessage('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }

        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            setMessageType('error');
            setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (token === "Admin" && userId) {
            router.push(`/admin/${userId}`); 
        } else if (token === "User" && userId){
            router.push(`/user/${userId}`);
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex justify-center items-center px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100"
                >
                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">เข้าสู่ระบบ</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                                อีเมล
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email" 
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                    placeholder="your@gmail.com"
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                รหัสผ่าน
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="password" 
                                    id="password"
                                    name="password" 
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>
                        <motion.button 
                            type="submit" 
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LogIn className="mr-2" size={20} />
                            เข้าสู่ระบบ
                        </motion.button>
                    </form>
                    {message && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-center mt-4 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                    <p className="mt-4 text-center text-sm text-gray-600">
                        ยังไม่มีบัญชี? {' '}
                        <a href="/Register" className="font-medium text-blue-600 hover:text-blue-500">
                            ลงทะเบียนที่นี่
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
