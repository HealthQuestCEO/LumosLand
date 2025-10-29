import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DopamineFeelingsGrid({ feelings, onSelectFeeling }) {
  const [showHint, setShowHint] = useState(null);

  const handleShowHint = (feeling) => {
    setShowHint(feeling);
  };

  const handleSelectFeeling = (feeling) => {
    setShowHint(null);
    onSelectFeeling(feeling);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f8f5] to-[#66bfad]/20 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-0 rounded-3xl">
          <CardContent className="p-6 sm:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1165b3] mb-4" style={{ fontFamily: 'Poppins' }}>
                How do I feel right now?
              </h2>
              <p className="text-gray-600" style={{ fontFamily: 'Poppins' }}>
                Pick the feeling that fits best. It's okay if more than one feels true.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {feelings?.map((feeling, index) => (
                <motion.div
                  key={feeling.feeling_id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleShowHint(feeling)}
                    className="w-full h-32 sm:h-40 bg-white hover:bg-gradient-to-br from-[#e0f8f5] to-white border-2 border-[#66bfad]/30 hover:border-[#66bfad] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all"
                  >
                    <span className="text-4xl sm:text-5xl">{feeling.emoji}</span>
                    <span className="text-lg sm:text-xl font-bold text-[#1165b3]" style={{ fontFamily: 'Poppins' }}>
                      {feeling.label_en}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!showHint} onOpenChange={() => setShowHint(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl" style={{ fontFamily: 'Poppins' }}>
              <span className="text-4xl">{showHint?.emoji}</span>
              {showHint?.label_en}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gradient-to-r from-[#e0f8f5] to-white rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-[#1165b3] mb-3" style={{ fontFamily: 'Poppins' }}>
                How do I know?
              </h3>
              <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                {showHint?.hint_en}
              </p>
            </div>
            <Button
              onClick={() => handleSelectFeeling(showHint)}
              className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Yes, this is how I feel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}