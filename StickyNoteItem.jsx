import React from "react";
import { motion } from "framer-motion";

export default function StickyNoteItem({ item }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-1 shadow-md relative w-24 h-24 overflow-hidden"
      style={{
        transform: `rotate(${Math.random() * 4 - 2}deg)`,
      }}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {item.item_image ? (
          <img 
            src={item.item_image}
            alt={item.item_name}
            className="absolute inset-0 w-full h-full object-contain scale-[2]"
            style={{ transformOrigin: 'center center' }}
          />
        ) : (
          <div className="text-6xl">{item.item_emoji}</div>
        )}
      </div>
    </motion.div>
  );
}