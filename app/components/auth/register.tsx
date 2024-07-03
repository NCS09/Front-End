'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const router = useRouter();

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        const formData = { firstname, lastname, email, password };

        try {
            const response = await fetch("http://localhost:8000/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            setMessage(result.message);
            //router.push("/Success");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="flex justify-center h-full items-center min-h-screen bg-yellow-100">
            <div className="bg-lime-300 p-3 rounded-lg shadow-md w-full max-w-md">
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
                        <input type="text" name="firstname" className="w-full px-3 bg-gray-100 rounded" onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            สกุล
                        </label>
                        <input type="text" name="lastname" className="w-full px-3 bg-gray-100 rounded" onChange={(e) => setLastname(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            อีเมล
                        </label>
                        <input type="email" name="email" className="w-full px-3 bg-gray-100 rounded" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm text-gray-700">
                            รหัสผ่าน
                        </label>
                        <input type="password" name="password" className="w-full px-3 bg-gray-100 rounded" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="w-full py-2 px-3 bg-yellow-300 rounded hover:bg-amber-700 hover:text-white">
                            ลงทะเบียน
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
