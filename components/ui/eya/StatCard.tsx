// components/eya/StatCard.tsx
"use client";
import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  accent?: string;
}

export default function StatCard({ value, label, accent = "bg-blue-600" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-md p-6 text-center"
    >
      <div className={`inline-block w-12 h-12 rounded-full ${accent} text-white flex items-center justify-center mb-3 text-xl`}>
        ✓
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </motion.div>
  );
}