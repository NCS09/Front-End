'use client';
import Sidebar from '../components/auth/sidebar';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const AdminLayout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/Login');
    };

        useEffect(()=>{
        const isLogin = localStorage.getItem("authToken")
        if(isLogin!=="isLogin"){
            router.push('/')
        }
    })

    return (
        <section className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <button
                    onClick={handleLogout}
                    className="mb-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                    Logout
                </button>
                {children}
            </main>
        </section>
    );
};

export default AdminLayout;
