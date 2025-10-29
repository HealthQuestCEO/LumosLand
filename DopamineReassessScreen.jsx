import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DopamineReassessScreen({ content, onSubmit }) {
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
              <div className="text-6xl sm:text-8xl mb-6">🤔</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1165b3] mb-6" style={{ fontFamily: 'Poppins' }}>
                {content?.heading_en || "Let's check in again."}
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 mb-8" style={{ fontFamily: 'Poppins' }}>
                {content?.prompt_en || "Do I still want the chips (or snack I was thinking about)?"}
              </p>
            </div>

            <div className="grid gap-4">
              <Button
                onClick={() => onSubmit(true)}
                className="w-full bg-gradient-to-r from-[#ffa400] to-[#ff8c00] text-white py-6 text-lg sm:text-xl rounded-2xl hover:shadow-lg"
                style={{ fontFamily: 'Poppins' }}
              >
                {content?.yes_text_en || "Yes, I still want it"}
              </Button>
              <Button
                onClick={() => onSubmit(false)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-6 text-lg sm:text-xl rounded-2xl hover:shadow-lg"
                style={{ fontFamily: 'Poppins' }}
              >
                {content?.no_text_en || "No, I feel better now"}
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>
                Either answer is okay! You did great exploring your feelings.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}