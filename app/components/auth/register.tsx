'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from './Success';
import Navbar from './navbars';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Phone, Briefcase, BookOpen, Building, Hash } from 'lucide-react';

export default function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [id, setId] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [duty, setDuty] = useState<string>('');
    const [faculty, setFaculty] = useState<string>('');
    const [branch, setBranch] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Check if all fields are filled
        if (!id || !firstname || !lastname || !email || !password || !phone || !duty || !faculty || !branch) {
            setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }

        const formData = { id, email, password, firstname, lastname, phone, duty, faculty, branch };

        try {

        
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
    
                },
                body: JSON.stringify(formData),
                
            });
            const result = await response.json();
            if (result.type == "ok") {
                setMessage(result.message);
                setSuccessModalOpen(true);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('เกิดข้อผิดพลาด โปรดลองอีกครั้งในภายหลัง');
        }
    };

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
                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">สมัครสมาชิก</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="id">
                                รหัส
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="รหัส"
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="firstname">
                                    ชื่อ
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="ชื่อ"
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastname">
                                    นามสกุล
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="นามสกุล"
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
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
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your@email.com"
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
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                                เบอร์ติดต่อ
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="xxx-xxx-xxxx"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="duty">
                                ตำแหน่ง
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    id="duty"
                                    name="duty"
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={(e) => setDuty(e.target.value)}
                                >
                                    <option value="">เลือกตำแหน่ง</option>
                                    <option value="นิสิต">นิสิต</option>
                                    <option value="อาจารย์/เจ้าหน้าที่">อาจารย์/เจ้าหน้าที่</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="faculty">
                                คณะ
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="faculty"
                                    name="faculty"
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="คณะของคุณ"
                                    onChange={(e) => setFaculty(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="branch">
                                สาขา
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    id="branch"
                                    name="branch"
                                    required
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="สาขาของคุณ"
                                    onChange={(e) => setBranch(e.target.value)}
                                />
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <UserPlus className="mr-2" size={20} />
                            สมัครสมาชิก
                        </motion.button>
                    </form>
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mt-4 text-red-500"
                        >
                            {error}
                        </motion.p>
                    )}
                    <p className="mt-4 text-center text-sm text-gray-600">
                        มีบัญชีอยู่แล้ว? {' '}
                        <a href="/Login" className="font-medium text-blue-600 hover:text-blue-500">
                            เข้าสู่ระบบที่นี่
                        </a>
                    </p>
                </motion.div>
            </div>
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setSuccessModalOpen(false)}
            />
        </div>
    );
}