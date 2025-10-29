import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BubbleGameSession({ lessonData, gameConfig, onComplete, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hideQuestion, setHideQuestion] = useState(false);
  const [poppedBubble, setPoppedBubble] = useState(null);

  const currentQ = lessonData?.questions?.[currentIndex];
  const totalQuestions = lessonData?.questions?.length || 0;
  const isLast = currentIndex === totalQuestions - 1;

  // Extract text from any value type
  const extractText = (value) => {
    if (!value) return "";
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'object') {
      // Handle new format: {id, text, isCorrect}
      if (value.text) return value.text;
      if (value.answer) return value.answer;
      if (value.ans) return value.ans;
    }
    return String(value);
  };

  // Get question text (handle both old and new formats)
  const questionText = currentQ?.questionText || currentQ?.question || "";

  // Get options array (handle both string[] and object[] formats)
  let options = [];
  if (currentQ?.options && Array.isArray(currentQ.options)) {
    options = currentQ.options.map(opt => extractText(opt));
  }

  const bubbleColors = [
    { bg: "#66bfad", text: "#ffffff", label: "A" },
    { bg: "#00d1ff", text: "#ffffff", label: "B" },
    { bg: "#1165b3", text: "#ffffff", label: "C" },
    { bg: "#ffa400", text: "#ffffff", label: "D" }
  ];

  const handleBubbleClick = (answerIndex) => {
    if (poppedBubble !== null) return;

    let correct = false;
    
    // Check for new format (isCorrect flag in options)
    if (currentQ.options && typeof currentQ.options[answerIndex] === 'object' && 'isCorrect' in currentQ.options[answerIndex]) {
      correct = currentQ.options[answerIndex].isCorrect === true;
    }
    // Check for old format (1-based answer index)
    else if (currentQ.answer !== undefined) {
      correct = answerIndex === (currentQ.answer - 1);
    }

    setIsCorrect(correct);
    setPoppedBubble(answerIndex);
    setHideQuestion(true);

    if (correct) {
      setScore(score + 1);
      if (!lessonData.is_assessment) {
        setCoinsEarned(coinsEarned + (lessonData.coins_per_correct || 10));
      }
    }

    setTimeout(() => {
      setPoppedBubble(null);
      setHideQuestion(false);

      if (isLast) {
        onComplete({
          correctAnswers: correct ? score + 1 : score,
          totalQuestions: lessonData.questions.length,
          coinsEarned: coinsEarned + (correct && !lessonData.is_assessment ? (lessonData.coins_per_correct || 10) : 0),
          xpEarned: lessonData.xp_reward || lessonData.rewards?.xp || 50
        });
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1000);
  };

  const bubblePositions = [
    { top: "15%", left: "15%" },
    { top: "15%", right: "15%" },
    { top: "50%", left: "50%", transform: "translateX(-50%)" },
    { bottom: "10%", left: "35%" }
  ];

  const backgroundBubbles = React.useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      size: Math.random() * 100 + 50,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)].bg,
    }));
  }, [currentIndex]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-50 overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.startX}%`,
              top: `${bubble.startY}%`,
              backgroundColor: bubble.color,
              opacity: 0.15,
              boxShadow: `inset 0 -4px 8px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.3)`,
            }}
            animate={{
              y: [0, -120, 0, 120, 0],
              x: [0, 60, 0, -60, 0],
              scale: [1, 1.3, 1, 0.7, 1],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bubble.delay,
            }}
          >
            <div 
              className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full bg-white opacity-40"
              style={{ filter: 'blur(8px)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Top Bar */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <div className="bg-[#66bfad] text-white rounded-full px-6 py-2 shadow-lg">
            <span className="text-sm font-bold">Question {currentIndex + 1} of {totalQuestions}</span>
          </div>

          {!lessonData.is_assessment && (
            <div className="bg-white rounded-full px-6 py-2 shadow-lg">
              <span className="text-lg font-bold text-[#10b981]">{score} correct 🎯</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      {!hideQuestion && (
        <div className="relative z-10 max-w-2xl mx-auto px-4 pb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-[#1165b3]"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#1165b3] text-center">
              {questionText}
            </h2>
          </motion.div>
        </div>
      )}

      {/* Answer Bubbles */}
      <div className="relative z-20 h-96">
        <AnimatePresence>
          {options.map((option, idx) => {
            const color = bubbleColors[idx] || bubbleColors[0];
            const position = bubblePositions[idx] || bubblePositions[0];
            const isPopped = poppedBubble === idx;

            return (
              <motion.button
                key={idx}
                onClick={() => handleBubbleClick(idx)}
                disabled={poppedBubble !== null}
                className="absolute"
                style={position}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isPopped 
                    ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } 
                    : { 
                        scale: 1, 
                        opacity: 1,
                        y: [0, -8, 0],
                      }
                }
                transition={
                  isPopped 
                    ? { duration: 1 } 
                    : { 
                        scale: { delay: idx * 0.1, type: "spring", stiffness: 200 },
                        opacity: { delay: idx * 0.1, duration: 0.5 },
                        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }
                      }
                }
                whileHover={!isPopped ? { scale: 1.08 } : {}}
                whileTap={!isPopped ? { scale: 0.95 } : {}}
              >
                <div
                  className="relative w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-center px-5 shadow-2xl cursor-pointer transition-all"
                  style={{
                    backgroundColor: color.bg,
                    color: color.text,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.3)`
                  }}
                >
                  <div 
                    className="absolute top-5 left-5 w-12 h-12 rounded-full bg-white opacity-30"
                    style={{ filter: 'blur(6px)' }}
                  />
                  
                  <div className="relative z-10">
                    <div className="text-xl font-bold mb-1">{color.label}.</div>
                    <div className="text-xs md:text-sm font-semibold leading-tight">{option}</div>
                  </div>
                </div>

                {isPopped && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.bg }}
                        initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          x: Math.cos((i * Math.PI * 2) / 8) * 100,
                          y: Math.sin((i * Math.PI * 2) / 8) * 100,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{ duration: 0.8 }}
                      />
                    ))}
                  </>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}