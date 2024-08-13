'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-blue-950 p-3">
            <div className="flex mx-3 justify-between text-white text-md font-bold">
                <Link href="/">โลโก้</Link>
                <div>
                    <Link href="/Login" className="pr-4 hover:text-blue-500">เข้าสู่ระบบ</Link>
                    <Link href="/Register" className="hover:text-blue-500">สมัครสมาชิก</Link>
                </div>
            </div>
        </nav>
    );
}
