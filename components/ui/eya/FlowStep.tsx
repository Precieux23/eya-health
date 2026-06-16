/// components/eya/FlowStep.tsx
"use client";
import { motion } from "framer-motion";

interface FlowStepProps {
  icon: string;
  title: string;
  text: string;
}

export default function FlowStep({ icon, title, text }: FlowStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center p-4"
    >
      <div className="w-20 h-20 rounded-xl bg-white shadow flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h4 className="font-semibold text-lg text-blue-700 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 max-w-xs">{text}</p>
    </motion.div>
  );
}
