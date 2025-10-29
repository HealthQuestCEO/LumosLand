import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight } from "lucide-react";

export default function RoomCard({ title, description, icon, pageName, gradient }) {
  return (
    <Link to={createPageUrl(pageName)}>
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-black/10 bg-gradient-to-br ${gradient} h-full`}>

        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="text-5xl mb-3">{icon}</div>
            <h3 className="text-sky-700 mb-2 text-xl font-bold">{title}</h3>
            <p className="text-[var(--color-border-blue)] text-sm">{description}</p>
          </div>
          <div className="flex justify-end mt-4">
            <ChevronRight className="w-6 h-6 text-[var(--color-border-blue)]/50" />
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-black/5 rounded-full blur-2xl" />
      </motion.div>
    </Link>);

}