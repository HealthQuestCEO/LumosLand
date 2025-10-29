import React from "react";
import { motion } from "framer-motion";
import { Coins, Zap } from "lucide-react";

export default function StatsDisplay({ coins, xp }) {
  return (
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-[#ffa400] to-[#ff8c00] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
      >
        <Coins className="w-5 h-5" />
        <span>{coins}</span>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-[#1165b3] to-[#66b6ad] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
      >
        <Zap className="w-5 h-5" />
        <span>{xp} XP</span>
      </motion.div>
    </div>
  );
}