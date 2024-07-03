'use client'

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

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
            });

            const result = await response.json();
            setMessage(result.message);
            router.push("/Dashboard");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="flex justify-center h-full items-center min-h-screen bg-yellow-100">
            <div className="bg-amber-900 p-3 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center">
                    <h1 className="font-bold">
                        เข้าสู่ระบบ
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm text-slate-500">
                            อีเมล
                        </label>
                        <input type="email" name="email" className="w-full px-3 bg-gray-100 rounded" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <label className="block mb-2 mt-2 text-sm text-slate-500">
                            รหัสผ่าน
                        </label>
                        <input type="password" name="password" className="w-full px-3 bg-gray-100 rounded" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="w-full py-2 px-3 bg-yellow-300 rounded hover:bg-amber-700 hover:text-white">
                            เข้าสู่ระบบ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
