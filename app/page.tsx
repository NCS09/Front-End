"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Clock, HelpCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 w-full py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ระบบการยืมคืนอุปกรณ์อิเล็กทรอนิกส์
          </motion.h1>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            บริการยืมคืนอุปกรณ์เช่น ตัวต้านทาน บอร์ดไมโครคอนโทรลเลอร์ และอุปกรณ์อื่น ๆ ภายในห้องแลป
          </motion.p>
          <motion.a
            href="/Login"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300  transition-colors"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            เริ่มต้นใช้งาน
          </motion.a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* About Section */}
        <section className="bg-white text-gray-900 text-center py-8 px-6 rounded-lg shadow-lg mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            เกี่ยวกับเรา
          </motion.h2>
          <motion.p 
            className="text-lg mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            เรามีระบบที่ช่วยให้คุณสามารถยืมและคืนอุปกรณ์อิเล็กทรอนิกส์ที่ใช้ในห้องแลปได้อย่างง่ายดาย ไม่ว่าจะเป็นตัวต้านทาน, บอร์ดไมโครคอนโทรลเลอร์, หรืออุปกรณ์อื่น ๆ ที่เกี่ยวข้อง
          </motion.p>
          <motion.img
            src="https://th.bing.com/th/id/OIP.U59Momm1BOijpyfoz3DlJgHaEK?rs=1&pid=ImgDetMain" 
            alt="อุปกรณ์อิเล็กทรอนิกส์" 
            className="mx-auto rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </section>

        {/* Features Section */}
        <section className="bg-gradient-to-r from-blue-50 to-white text-gray-900 text-center py-8 px-6 rounded-lg shadow-lg">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ฟีเจอร์เด่นของเรา
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ระบบที่ใช้งานง่าย</h3>
              <p>ระบบของเรามีอินเทอร์เฟซที่ใช้งานง่ายและสะดวกสบายในการยืมคืนอุปกรณ์</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">การติดตามสถานะ</h3>
              <p>ติดตามสถานะการยืมและคืนของอุปกรณ์ได้อย่างรวดเร็วและแม่นยำ</p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-4">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">บริการลูกค้า</h3>
              <p>ทีมงานของเราพร้อมให้ความช่วยเหลือและตอบคำถามเกี่ยวกับการใช้งานระบบ</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center py-4 w-full">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} ระบบการยืมคืนอุปกรณ์อิเล็กทรอนิกส์. สงวนลิขสิทธิ์.</p>
        </div>
      </footer>
    </div>
  );
}
