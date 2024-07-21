// Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebarpage() {
    return (
        
        <aside className="w-1/5 bg-blue-600 text-white p-4">
            <div className="py-4 text-center text-2xl font-bold">Admin</div>
            <ul>
                <li className="py-2">
                    <Link href="/admin/Dashboard" className="block hover:text-blue-500 transition-colors duration-200">หน้าหลัก</Link>
                </li>
                <li className="py-2">
                    <Link href="#" className="block hover:text-blue-500 transition-colors duration-200">คำร้องขอ</Link>
                </li>
                <li className="py-2">
                    <Link href="/admin/Managedevices" className="block hover:text-blue-500 transition-colors duration-200">จัดการอุปกรณ์</Link>
                </li>
                <li className="py-2">
                    <Link href="#" className="block hover:text-blue-500 transition-colors duration-200">ออกรายงาน</Link>
                </li>
                <li className="py-2">
                    <Link href="#" className="block hover:text-blue-500 transition-colors duration-200">แก้ไขรหัสผ่าน</Link>
                </li>
                <li className="py-2">
                    <Link href="#" className="block hover:text-blue-500 transition-colors duration-200">ดูประวัติทั้งหมด</Link>
                </li>
            </ul>
        </aside>
    )
}