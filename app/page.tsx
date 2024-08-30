"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, Clock, HelpCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 w-full py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/logo.svg" alt="Elec@UP Logo" width={300} height={100} className="pb-10"/>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              ยืม-คืนอุปกรณ์อิเล็กทรอนิกส์<br />ง่ายๆ ในคลิกเดียว
            </h1>
            <p className="text-xl mb-8 opacity-90">
              บริการยืม-คืนอุปกรณ์ห้องแลป เช่น ตัวต้านทาน บอร์ดไมโครคอนโทรลเลอร์ และอื่นๆ อย่างสะดวกรวดเร็ว
            </p>
            <motion.a
              href="/Login"
              className="inline-flex items-center bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              เริ่มต้นใช้งาน
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.a>
          </motion.div>
          <motion.div 
            className="md:w-1/2 mt-8 md:mt-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/hero-image.png"
              alt="อุปกรณ์อิเล็กทรอนิกส์"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* About Section */}
        <section className="mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ทำไมต้องใช้บริการของเรา?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: "ใช้งานง่าย", description: "อินเทอร์เฟซที่เรียบง่าย ใช้งานได้ทุกอุปกรณ์" },
              { icon: Clock, title: "ประหยัดเวลา", description: "ลดขั้นตอนการยืม-คืน ให้คุณมีเวลาทำงานมากขึ้น" },
              { icon: HelpCircle, title: "ซัพพอร์ตตลอด 24/7", description: "ทีมงานพร้อมช่วยเหลือคุณตลอดเวลา" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <item.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-blue-50 py-16 px-4 rounded-2xl mb-20">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            วิธีการใช้งาน
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-around items-center space-y-8 md:space-y-0">
            {[
              { step: 1, title: "ลงทะเบียน", description: "สร้างบัญชีผู้ใช้ด้วยอีเมลสถาบัน" },
              { step: 2, title: "เลือกอุปกรณ์", description: "เลือกอุปกรณ์ที่ต้องการยืมจากรายการ" },
              { step: 3, title: "ยืนยันการยืม", description: "ตรวจสอบและยืนยันรายการยืม" },
              { step: 4, title: "รับอุปกรณ์", description: "รับอุปกรณ์ที่จุดบริการตามเวลาที่กำหนด" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-center max-w-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            พร้อมเริ่มใช้งานแล้วหรือยัง?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            เริ่มต้นใช้งานระบบยืม-คืนอุปกรณ์อิเล็กทรอนิกส์ได้เลยวันนี้
          </motion.p>
          <motion.a
            href="/Register"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            สมัครใช้งานฟรี
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 w-full">
        <div className="container mx-auto px-4">
          <p className="mb-4">&copy; {new Date().getFullYear()} ระบบการยืม-คืนอุปกรณ์อิเล็กทรอนิกส์. สงวนลิขสิทธิ์.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-blue-400 transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-blue-400 transition-colors">เงื่อนไขการใช้งาน</a>
            <a href="#" className="hover:text-blue-400 transition-colors">ติดต่อเรา</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
