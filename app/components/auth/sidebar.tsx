'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Sidebarpage() {
    const pathname = usePathname();
    const [active, setActive] = useState<string>(pathname.split('/').pop() || 'Dashboard');
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
                <div className={`text-3xl font-bold ${isOpen ? 'block' : 'hidden'}`}>Admin</div>
                <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
            {isOpen && (
                <ul className="flex flex-col space-y-4">
                    <li>
                        <Link 
                            href="/admin/Dashboard" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Dashboard' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Dashboard')}
                        >
                            หน้าหลัก
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/Requests" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Requests' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Requests')}
                        >
                            คำร้องขอ
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/Managedevices" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Managedevices' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Managedevices')}
                        >
                            จัดการอุปกรณ์
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/Reports" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'Reports' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('Reports')}
                        >
                            ออกรายงาน
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/ChangePassword" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'ChangePassword' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('ChangePassword')}
                        >
                            แก้ไขรหัสผ่าน
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/History" 
                            className={`block text-left px-4 py-2 rounded-md ${active === 'History' ? 'bg-blue-600 text-yellow-300' : 'hover:bg-blue-700 transition-colors duration-200'}`}
                            onClick={() => handleClick('History')}
                        >
                            ดูประวัติทั้งหมด
                        </Link>
                    </li>
                </ul>
            )}
        </aside>
    );
}
