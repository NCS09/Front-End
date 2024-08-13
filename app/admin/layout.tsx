'use client';
import Sidebar from '../components/auth/sidebar';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../components/auth/Navbar';
const AdminLayout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

        useEffect(()=>{
        const isLogin = localStorage.getItem("authToken")
        if(isLogin!=="Admin"){
            router.push('/')
        }
    })

    return (
        <>
        <Navbar/>
        <section className="flex min-h-screen">
        <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </section>
        </>

    );
};

export default AdminLayout;
