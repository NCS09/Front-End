// Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt_decode, { JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
    role: string;
}

const Sidebar = () => {
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                //const decoded: DecodedToken = jwt_decode<DecodedToken>(token);
                //setRole(decoded.role);
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token');
                router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <ul className="flex flex-col mt-4">
                {role === 'admin' && (
                    <>
                        <li className="px-4 py-2 hover:bg-gray-700">
                            <Link href="/admin/devices">Manage Devices</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700">
                            <Link href="/admin/users">Manage Users</Link>
                        </li>
                    </>
                )}
                {role === 'user' && (
                    <>
                        <li className="px-4 py-2 hover:bg-gray-700">
                            <Link href="/user/devices">View Devices</Link>
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-700">
                            <Link href="/user/profile">Profile</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
