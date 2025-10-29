import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MunchiesSpinner({ topics, recentTopics, onSpinComplete }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedTopic(null);

    // Filter out recent topics
    const availableTopics = topics.filter(t => !recentTopics.includes(t.id));
    const topicsToUse = availableTopics.length > 0 ? availableTopics : topics;
    
    // Pick random topic
    const randomTopic = topicsToUse[Math.floor(Math.random() * topicsToUse.length)];
    const topicIndex = topics.findIndex(t => t.id === randomTopic.id);
    
    // Calculate rotation
    const segmentAngle = 360 / topics.length;
    const targetAngle = 360 - (topicIndex * segmentAngle) - (segmentAngle / 2);
    const spins = 5 * 360; // 5 full rotations
    const finalRotation = spins + targetAngle;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSpinning(false);
      setSelectedTopic(randomTopic);
    }, 4000);
  };

  return (
    <Card className="border-2 border-[#66bfad]/30 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-[#1165b3] text-center" style={{ fontFamily: 'Poppins' }}>
          🎡 Spin the Wheel!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full max-w-md mx-auto aspect-square">
          {/* Spinner wheel */}
          <motion.div
            className="w-full h-full rounded-full overflow-hidden shadow-2xl relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: "easeOut" }}
          >
            {topics.map((topic, index) => {
              const angle = (360 / topics.length) * index;
              return (
                <div
                  key={topic.id}
                  className="absolute w-full h-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "50% 50%"
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-start justify-center pt-8"
                    style={{
                      backgroundColor: topic.color,
                      clipPath: `polygon(0 0, 100% 0, 50% 100%)`,
                      transform: `rotate(${360 / topics.length / 2}deg)`
                    }}
                  >
                    <span className="text-white font-bold text-sm transform -rotate-90">
                      {topic.name}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center text-3xl">
              🍽️
            </div>
          </motion.div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-500" />
          </div>
        </div>

        {!spinning && !selectedTopic && (
          <Button
            onClick={handleSpin}
            className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
            style={{ fontFamily: 'Poppins' }}
          >
            Spin the Wheel!
          </Button>
        )}

        {spinning && (
          <div className="text-center">
            <p className="text-xl text-[#1165b3] font-bold animate-pulse">Spinning...</p>
          </div>
        )}

        {!spinning && selectedTopic && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-white to-[#e0f8f5] rounded-2xl p-6 border-2 border-[#66bfad]/30">
              <h3 className="text-2xl font-bold text-[#1165b3] mb-4 text-center" style={{ fontFamily: 'Poppins' }}>
                {selectedTopic.name}
              </h3>
              <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Poppins' }}>
                {selectedTopic.prompts}
              </p>
            </div>
            <Button
              onClick={() => onSpinComplete(selectedTopic)}
              className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl"
              style={{ fontFamily: 'Poppins' }}
            >
              Start Timer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}