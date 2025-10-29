import React from "react";
import { motion } from "framer-motion";

export default function NeedBar({ label, value, icon }) {
  const getBarColor = () => {
    if (value >= 70) return "#00d1ff"; // Teal
    if (value >= 40) return "#ffa400"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-border-blue)] flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {label}
        </span>
        <span className="text-sm font-bold text-[#1165b3]">{Math.round(value)}%</span>
      </div>
      <div className="h-3 bg-gray-200/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: getBarColor() }}
        />
      </div>
    </div>
  );
}