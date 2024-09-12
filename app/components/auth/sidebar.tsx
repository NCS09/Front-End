'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiBox, FiClipboard, FiRotateCcw, FiPlusCircle, FiList, FiLock, FiFileText, FiCheckCircle } from 'react-icons/fi';

interface SidebarpageProps {
    userId: string;
}

export default function Sidebarpage({ userId }: SidebarpageProps) {
    const pathname = usePathname();
    const [active, setActive] = useState<string>(pathname.split('/').pop() || 'Dashboard');
    const [isOpen, setIsOpen] = useState<boolean>(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClick = (path: string) => {
        setActive(path);
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { path: '', label: 'หน้าหลัก/ออกรายงาน', icon: FiHome },
        { path: 'Managedevices', label: 'จัดการอุปกรณ์', icon: FiBox },
        { path: 'Requests', label: 'คำร้องขอ', icon: FiClipboard },
        { path: 'Return', label: 'ยืนยันการคืน', icon: FiRotateCcw },
        { path: 'AddBorrow', label: 'ยืมอุปกรณ์', icon: FiPlusCircle },
        { path: 'adminHistory', label: 'ดูประวัติทั้งหมด', icon: FiList },
        { path: 'addconfirm', label: 'ยืนยันรับของ', icon: FiCheckCircle },
        
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? '240px' : '60px' }}
            className="bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 flex flex-col min-h-screen shadow-lg"
        >
            <div className="flex justify-between items-center mb-8">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-2xl font-bold"
                        >
                            Welcome Admin
                        </motion.div>
                    )}
                </AnimatePresence>
                <button onClick={toggleSidebar} className="text-2xl focus:outline-none hover:text-yellow-300 transition-colors duration-200">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
            <ul className="flex flex-col space-y-2 flex-grow">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link 
                            href={`/admin/${userId}${item.path ? `/${item.path}` : ''}`}
                            className={`flex items-center rounded-md overflow-hidden ${
                                active === item.path ? 'bg-blue-500 text-yellow-300' : 'hover:bg-blue-700'
                            } transition-all duration-200`}
                            onClick={() => handleClick(item.path)}
                        >
                            <motion.div
                                className="flex items-center w-full p-2"
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.aside>
    );
}