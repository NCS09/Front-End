'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const router = useRouter();

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        const formData = { email, password , firstname, lastname};

        try {
            const response = await fetch("http://localhost:8000/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const result = await response.json();
            if (result.type == "ok"){
                setMessage(result.message);
                router.push("/Success");
            } else {
                setMessage(result.message);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="flex justify-center h-full items-center min-h-screen bg-blue-100">
            <div className="bg-slate-50 p-3 rounded-lg shadow-md w-full max-w-md border-2 border-blue-900">
                <div className="text-center">
                    <h1 className="font-bold">
                        สมัครสมาชิก
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            ชื่อ
                        </label>
                        <input type="text" name="firstname" className="w-full px-3 bg-gray-200 rounded" onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            สกุล
                        </label>
                        <input type="text" name="lastname" className="w-full px-3 bg-gray-200 rounded" onChange={(e) => setLastname(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            อีเมล
                        </label>
                        <input type="email" name="email" className="w-full px-3 bg-gray-200 rounded" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            รหัสผ่าน
                        </label>
                        <input type="password" name="password" className="w-full px-3 bg-gray-200 rounded" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="w-full py-2 px-3 bg-blue-950 rounded hover:bg-blue-500 hover:text-white">
                            ลงทะเบียน
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
