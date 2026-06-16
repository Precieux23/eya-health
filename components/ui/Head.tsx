"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 shadow-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-baseline gap-1"
        >
          <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent tracking-tighter">
            EYA
          </span>
          <span className="text-lg sm:text-xl font-light text-blue-600/80">
            Health
          </span>
        </motion.div>

        {/* Menu */}
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <Link href="#origine" className="hover:text-blue-600 transition">ORIGINE</Link>
          <Link href="#fonctionnement" className="hover:text-blue-600 transition">FONCTIONNEMENT</Link>
          <Link href="#objectifs" className="hover:text-blue-600 transition">OBJECTIFS</Link>
        </nav>
      </div>
    </header>
  );
}
