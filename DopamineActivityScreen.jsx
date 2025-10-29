import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function DopamineActivityScreen({ activities, onComplete }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          setTimeElapsed(prev => prev + 1);
          
          if (newTime <= 0) {
            setIsTimerRunning(false);
            handleActivityComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setTimeRemaining(activity.preset_seconds);
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(selectedActivity.preset_seconds);
    setTimeElapsed(0);
  };

  const handleActivityComplete = () => {
    onComplete(selectedActivity, timeElapsed);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = selectedActivity ? ((selectedActivity.preset_seconds - timeRemaining) / selectedActivity.preset_seconds) * 100 : 0;

  if (!selectedActivity) {
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
                  Pick an activity to try
                </h2>
              </div>

              <div className="grid gap-4">
                {activities?.map((activity, index) => (
                  <motion.div
                    key={activity.activity_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => handleSelectActivity(activity)}
                      className="w-full bg-white hover:bg-gradient-to-r from-[#e0f8f5] to-white border-2 border-[#66bfad]/30 hover:border-[#66bfad] rounded-2xl p-6 h-auto flex items-start gap-4 text-left transition-all"
                    >
                      <span className="text-4xl sm:text-5xl">{activity.emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-[#1165b3] mb-2" style={{ fontFamily: 'Poppins' }}>
                          {activity.label_en}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Poppins' }}>
                          {activity.instructions_en}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          ⏱️ {Math.floor(activity.preset_seconds / 60)} minutes
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f8f5] to-[#66bfad]/20 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 rounded-3xl">
          <CardContent className="p-6 sm:p-12">
            <div className="text-center mb-8">
              <div className="text-6xl sm:text-8xl mb-4">{selectedActivity.emoji}</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1165b3] mb-4" style={{ fontFamily: 'Poppins' }}>
                {selectedActivity.label_en}
              </h2>
              <p className="text-base sm:text-lg text-gray-700" style={{ fontFamily: 'Poppins' }}>
                {selectedActivity.instructions_en}
              </p>
            </div>

            <div className="mb-8">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e0e0e0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#66bfad"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-[#1165b3]" style={{ fontFamily: 'Poppins' }}>
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">remaining</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center mb-4">
              {!isTimerRunning && timeRemaining > 0 && (
                <Button
                  onClick={handleStartTimer}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6 rounded-2xl text-lg"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              )}
              {isTimerRunning && (
                <Button
                  onClick={handlePauseTimer}
                  className="bg-gradient-to-r from-[#ffa400] to-[#ff8c00] text-white px-8 py-6 rounded-2xl text-lg"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              {timeRemaining < selectedActivity.preset_seconds && !isTimerRunning && timeRemaining > 0 && (
                <Button
                  onClick={handleResetTimer}
                  variant="outline"
                  className="px-8 py-6 rounded-2xl text-lg"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            {timeRemaining === 0 && (
              <div className="text-center">
                <p className="text-xl font-bold text-green-600 mb-4" style={{ fontFamily: 'Poppins' }}>
                  🎉 Great job! You completed the activity!
                </p>
              </div>
            )}

            <Button
              onClick={() => setSelectedActivity(null)}
              variant="outline"
              className="w-full py-4 rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Choose a Different Activity
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}