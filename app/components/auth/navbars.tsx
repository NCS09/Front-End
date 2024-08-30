'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
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
                    </div>
                </div>
            </div>
        </nav>
    );
}