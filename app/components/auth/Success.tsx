'use client'

import Link from "next/link";
import { FaCheck } from "react-icons/fa";

export default function Success() {
    return (
        <div className="bg-amber-50 justify-center flex flex-col h-screen items-center">
            <div className="bg-white w-1/3 h-1/3 text-center p-4 rounded-lg flex flex-col justify-center items-center border-2 border-green-600">
                <h1 className="font-bold text-lg">ลงทะเบียนสำเร็จ</h1>
                <div className="mt-6 w-16 h-16 rounded-full border-2 border-green-600 flex justify-center items-center p-3">
                    <FaCheck className="text-5xl text-center text-green-600" />
                </div>
                <div className="mt-6">
                    <Link href="/Login" className="w-full py-2 px-3 bg-blue-950 rounded hover:bg-blue-500 hover:text-white">
                            กลับสู่หน้าหลัก
                    </Link>
                </div>
            </div>
        </div>
    );
}
