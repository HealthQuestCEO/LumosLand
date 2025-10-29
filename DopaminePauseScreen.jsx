import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DopaminePauseScreen({ content, onYes, onNo }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f8f5] to-[#66bfad]/20 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 rounded-3xl">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <div className="text-6xl sm:text-8xl mb-6">🥕</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1165b3] mb-6" style={{ fontFamily: 'Poppins' }}>
                {content?.prompt_en || "Would I be happy to eat a bag of carrots right now?"}
              </h2>
            </div>

            <div className="grid gap-4">
              <Button
                onClick={onYes}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 text-lg sm:text-xl rounded-2xl hover:shadow-lg"
                style={{ fontFamily: 'Poppins' }}
              >
                😊 Yes, I'm hungry!
              </Button>
              <Button
                onClick={onNo}
                className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg sm:text-xl rounded-2xl hover:shadow-lg"
                style={{ fontFamily: 'Poppins' }}
              >
                🤔 No, something else is going on
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                This helps you understand what your body really needs
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}