import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

export default function MunchiesTimer({ topic, onComplete }) {
  const [minutes, setMinutes] = useState(3);
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  };

  const handleComplete = () => {
    const minutesCompleted = minutes - Math.floor(timeLeft / 60);
    onComplete(minutesCompleted);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const xpForTime = Math.min(Math.floor((minutes * 60 - timeLeft) / 60) * 15, 75);

  return (
    <Card className="border-2 border-[#66bfad]/30 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-[#1165b3] text-center" style={{ fontFamily: 'Poppins' }}>
          ⏱️ Mindful Eating Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-white to-[#e0f8f5] rounded-2xl p-6 border-2 border-[#66bfad]/30">
          <h3 className="text-xl font-bold text-[#1165b3] mb-3 text-center" style={{ fontFamily: 'Poppins' }}>
            {topic.name}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Poppins' }}>
            {topic.prompts}
          </p>
        </div>

        {!isRunning && !isComplete && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <label className="text-gray-700 font-medium">Set Timer:</label>
              <Select value={minutes.toString()} onValueChange={(val) => {
                setMinutes(parseInt(val));
                setTimeLeft(parseInt(val) * 60);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="2">2 minutes</SelectItem>
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="4">4 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-[#1165b3] mb-2">{formatTime(timeLeft)}</div>
              <p className="text-sm text-gray-600">15 XP per minute (Max 75 XP)</p>
            </div>
            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Start Timer
            </Button>
          </div>
        )}

        {isRunning && (
          <div className="space-y-4">
            <div className="text-center">
              <motion.div
                className="text-8xl font-bold text-[#1165b3] mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-lg text-gray-700 mb-2">Current XP: {xpForTime}</p>
              <div className="flex justify-center gap-3">
                <Button onClick={handlePause} variant="outline">Pause</Button>
                <Button onClick={handleReset} variant="outline">Reset</Button>
              </div>
            </div>
          </div>
        )}

        {!isRunning && !isComplete && timeLeft < minutes * 60 && (
          <div className="text-center">
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white px-8"
            >
              Resume
            </Button>
          </div>
        )}

        {isComplete && (
          <div className="space-y-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600">Time's Up!</h3>
            <p className="text-gray-700">You earned {minutes * 15} XP!</p>
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Continue to Journal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}