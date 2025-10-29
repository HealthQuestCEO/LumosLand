import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Zap } from "lucide-react";

export default function MunchiesRewards({ timerXp, journalXp, journalCoins, onPlayAgain, onGoHome }) {
  const totalXp = timerXp + journalXp;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-[#66bfad]/30 shadow-2xl">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-[#1165b3] mb-6" style={{ fontFamily: 'Poppins' }}>
            Great Job!
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300">
              <Zap className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <div className="text-4xl font-bold text-yellow-600 mb-1">{totalXp} XP</div>
              <p className="text-sm text-gray-600">
                Timer: {timerXp} XP<br/>
                Journal: {journalXp} XP
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-300">
              <Coins className="w-12 h-12 mx-auto mb-3 text-orange-600" />
              <div className="text-4xl font-bold text-orange-600 mb-1">{journalCoins} Coins</div>
              <p className="text-sm text-gray-600">From your journal!</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Play Again
            </Button>
            <Button
              onClick={onGoHome}
              variant="outline"
              className="w-full py-4 rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}