'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('error');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const formData = { email, password };

        try {
            const response = await fetch("http://localhost:8000/login", {
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

                
                localStorage.setItem('authToken', 'isLogin');

                if (result.role == 2) {
                    router.push("/admin");
                } else {
                    router.push("/user/Productss");
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
        if (token=="isLogin") {
            
            router.push("/admin");
        }
    }, [router]);

    return (
        <div className="flex justify-center h-full items-center min-h-screen bg-blue-100">
            <div className="bg-slate-50 p-3 rounded-lg shadow-md w-full max-w-md border-2 border-blue-900">
                <div className="text-center">
                    <h1 className="font-bold">
                        เข้าสู่ระบบ
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            อีเมล
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            className="w-full px-3 bg-gray-200 rounded" 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block mb-2 mt-2 text-sm text-gray-700">
                            รหัสผ่าน
                        </label>
                        <input 
                            type="password" 
                            name="password" 
                            className="w-full px-3 bg-gray-200 rounded" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="mt-4">
                        <button 
                            type="submit" 
                            className="w-full py-2 px-3 bg-blue-950 rounded hover:bg-blue-500 hover:text-white"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>
                {message && (
                    <p className={`text-center mt-4 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
