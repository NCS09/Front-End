import Link from "next/link"
import Sidebar from "../components/auth/sidebar"
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <section className="flex min-h-screen">
            <aside className="w-1/5 bg-blue-600 text-white p-4">
                <div className="py-4 text-center text-2xl font-bold">Admin</div>
                <ul>
                    <li className="py-2">
                        <Link href="/Dashboard" className="block hover:text-blue-500 transition-colors duration-200">หน้าหลัก</Link>
                    </li>
                    <li className="py-2">
                        <Link href="#" className="block hover:text-blue-500 transition-colors duration-200">คำร้องขอ</Link>
                    </li>
                    <li className="py-2">
                        <Link href="#" className="block hover:text-blue-500 transition-colors duration-200">จัดการอุปกรณ์</Link>
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
            <main className="w-4/5 p-8">
                {children}
            </main>
        </section>
    )
  }