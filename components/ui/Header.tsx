"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 shadow-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6">
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

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 items-center">
          <Link href="#accueil" className="hover:text-blue-600 transition">
            ACCUEIL
          </Link>
          <Link href="#eya" className="hover:text-blue-600 transition">
            EYA
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            SE CONNECTER
          </Link>
        </nav>

        {/* Burger Button Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center focus:outline-none"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-blue-700 transition-all"
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-blue-700 transition-all"
          />
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-blue-700 transition-all"
          />
        </button>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-white/20"
          >
            <div className="flex flex-col space-y-4 px-6 py-6 text-sm font-medium text-gray-700">
              <Link
                href="#accueil"
                onClick={toggleMenu}
                className="hover:text-blue-600 transition py-2 border-b border-gray-100"
              >
                ACCUEIL
              </Link>
              <Link
                href="#eya"
                onClick={toggleMenu}
                className="hover:text-blue-600 transition py-2 border-b border-gray-100"
              >
                EYA
              </Link>
              <Link
                href="/login"
                onClick={toggleMenu}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition text-center"
              >
                SE CONNECTER
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
