import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DopamineRewardScreen({ coinsEarned, xpEarned }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f8f5] to-[#66bfad]/20 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#ffa400] to-[#ff8c00] p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
              You Did It!
            </h2>
            <p className="text-white/90 text-lg" style={{ fontFamily: 'Poppins' }}>
              Great job checking in with yourself!
            </p>
          </div>

          <CardContent className="p-8 sm:p-12">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#ffa400] to-[#ff8c00] rounded-2xl p-6 text-center"
              >
                <Coins className="w-12 h-12 mx-auto mb-2 text-white" />
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins' }}>
                  {coinsEarned}
                </div>
                <p className="text-white text-sm" style={{ fontFamily: 'Poppins' }}>Coins Earned</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#1165b3] to-[#66bfad] rounded-2xl p-6 text-center"
              >
                <Zap className="w-12 h-12 mx-auto mb-2 text-white" />
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins' }}>
                  {xpEarned}
                </div>
                <p className="text-white text-sm" style={{ fontFamily: 'Poppins' }}>XP Earned</p>
              </motion.div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
                style={{ fontFamily: 'Poppins' }}
              >
                Try Another Check-In
              </Button>
              <Button
                onClick={() => navigate(createPageUrl("Hub"))}
                variant="outline"
                className="w-full py-6 text-lg rounded-2xl"
                style={{ fontFamily: 'Poppins' }}
              >
                Back to The Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}