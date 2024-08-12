'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function UserSidebar() {
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
                            href="/user/Home" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Home' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Home')}
                        >
                            หน้าหลัก
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/user/Profile" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Profile' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Profile')}
                        >
                            โปรไฟล์
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/user/MyRequests" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'MyRequests' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('MyRequests')}
                        >
                            คำร้องขอของฉัน
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/user/BrowseDevices" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'BrowseDevices' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('BrowseDevices')}
                        >
                            ดูอุปกรณ์
                        </Link>
                    </li>
                </ul>
            )}
        </aside>
    );
}
