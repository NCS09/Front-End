'use client';

import Sidebarpage from '@/app/components/auth/sidebar';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import Navbar from '@/app/components/auth/Navbar';

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const isLogin = localStorage.getItem("authToken");
        const storedUserId = localStorage.getItem("userId");

        if (isLogin !== "Admin") {
            router.push('/');
        } else {
            setUserId(storedUserId ? parseInt(storedUserId, 10) : null);
        }
    }, [router]);

    return (
        <>
            <Navbar />
            <section className="flex min-h-screen">
                {userId !== null && <Sidebarpage userId={userId.toString()} />}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </section>
        </>
    );
};

export default AdminLayout;
