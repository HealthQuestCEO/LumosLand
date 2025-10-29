import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MunchiesWelcome({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="border-2 border-[#66bfad]/30 shadow-2xl">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="text-8xl mb-6">😊</div>
          <h2 className="text-3xl font-bold text-[#1165b3] mb-6" style={{ fontFamily: 'Poppins' }}>
            Hi friends! Ready for a mindful meal?
          </h2>
          <div className="bg-gradient-to-r from-[#e0f8f5] to-white rounded-2xl p-6 mb-8 text-left">
            <p className="text-lg text-gray-800 leading-relaxed" style={{ fontFamily: 'Poppins' }}>
              This spinner helps your family slow down and discover new things about your food and your bodies. 
              <br/><br/>
              <strong>Spin the wheel</strong>, set the timer, and talk about the topic while you eat! 
              <br/><br/>
              When the timer runs out, you get XP! Don't forget to fill out your <strong>Meal Journal</strong> for extra coins!
            </p>
          </div>
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white px-12 py-6 text-xl rounded-2xl"
            style={{ fontFamily: 'Poppins' }}
          >
            Let's Get Started! 🍽️
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}