'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface User {
    user_id: string;
    user_firstname: string;
    user_lastname: string;
    user_email: string;
    user_role: string;
    user_phone: string;
}

export default function Manageuserpage() {
    const router = useRouter()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editMessage, setEditMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/admin/list-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
            console.error('Error fetching users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditMessage(null);
        try {
            const response = await fetch(`${apiUrl}/admin/edit-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setEditMessage('ปรับปรุงข้อมูลผู้ใช้สำเร็จ');
                setEmail('');
                setPassword('');
                fetchUsers(); 
            } else {
                setEditMessage(data.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ใช้');
            }
        } catch (err) {
            setEditMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            console.error('Error editing user:', err);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">กำลังโหลด...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">จัดการผู้ใช้</h1>
            
            <form onSubmit={handleEditUser} className="mb-8 p-4 bg-gray-100 rounded">
                <h2 className="text-xl font-semibold mb-4">แก้ไขสถานะผู้ใช้เป็นแอดมิน</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">อีเมล:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2">รหัสผ่านใหม่:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    อัพเดทเป็นแอดมิน
                </button>
                {editMessage && (
                    <p className={`mt-2 ${editMessage.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
                        {editMessage}
                    </p>
                )}
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">ชื่อ</th>
                            <th className="px-4 py-2">นามสกุล</th>
                            <th className="px-4 py-2">อีเมล</th>
                            <th className="px-4 py-2">บทบาท</th>
                            <th className="px-4 py-2">เบอร์โทรศัพท์</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id} className="border-b">
                                <td className="px-4 py-2">{user.user_id}</td>
                                <td className="px-4 py-2">{user.user_firstname}</td>
                                <td className="px-4 py-2">{user.user_lastname}</td>
                                <td className="px-4 py-2">{user.user_email}</td>
                                <td className="px-4 py-2">{user.user_role}</td>
                                <td className="px-4 py-2">{user.user_phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}