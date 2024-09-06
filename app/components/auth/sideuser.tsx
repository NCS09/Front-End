'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

interface SidebarProps {
    userId: string; 
}

export default function Sidebarpage({ userId }: SidebarProps) {
    const pathname = usePathname();
    const [active, setActive] = useState<string>(pathname.split('/').pop() || 'Home');
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const handleClick = (path: string) => {
        setActive(path);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside className={`bg-blue-800 text-white p-6 flex flex-col transition-width duration-300 ${isOpen ? 'w-1/5' : 'w-0'}`}>
            <div className="flex justify-between items-center mb-8">
                <div className={`text-3xl font-bold ${isOpen ? 'block' : 'hidden'}`}>User</div>
                <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
            {isOpen && (
                <ul className="flex flex-col space-y-4">
                    <li>
                        <Link 
                            href={`/user/${userId}`} 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Home' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Home')}
                        >
                            หน้าหลัก
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href={`/user/${userId}/DeviceBorrow`} 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Devices' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Devices')}
                        >
                            คำร้องขอของฉัน
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href={`/user/${userId}/confirm`} 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'confirm' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('confirm')}
                        >
                            ยืนยันรับของ
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href={`/user/${userId}/return`} 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'return' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('return')}
                        >
                            รายการที่ต้องคืน
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href={`/user/${userId}/userhistory`} 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'userhistory' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('userhistory')}
                        >
                            ประวัติการยืม
                        </Link>
                    </li>
                </ul>
            )}
        </aside>
    );
}
