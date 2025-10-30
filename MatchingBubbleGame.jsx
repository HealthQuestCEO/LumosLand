// MatchingBubbleGame.jsx
// Bubble Pop style matching game with animated background

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeMatchingData, validateMatchingData } from './MatchGameDataAdapter';
import FloatingBubbles from './FloatingBubbles';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BUBBLE_COLORS = [
  '#66bfad', '#ffa400', '#00d1ff', '#4169e1', '#9b59b6',
  '#f39c12', '#2ecc71', '#e74c3c', '#ff69b4', '#8e44ad',
];

function MatchingBubbleGame({ lessonData, gameConfig, onComplete, onExit }) {
  const [gameData, setGameData] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [bubbleColors, setBubbleColors] = useState({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    try {
      const normalized = normalizeMatchingData(lessonData);
      const validation = validateMatchingData(normalized);

      if (!validation.valid) {
        console.error('[MatchingBubbleGame] Invalid matching data:', validation.error);
        return;
      }

      setGameData(normalized);

      // Assign random colors to each bubble
      const colors = {};
      normalized.pairs.forEach(pair => {
        colors[pair.left] = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        colors[pair.right] = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      });
      setBubbleColors(colors);
    } catch (error) {
      console.error('Error parsing match game:', error);
    }
  }, [lessonData]);

  const leftItems = useMemo(() => {
    if (!gameData) return [];
    return gameData.pairs.map(p => ({ id: p.id, text: p.left }));
  }, [gameData]);

  const rightItems = useMemo(() => {
    if (!gameData) return [];
    return gameData.pairs.map(p => ({ id: p.id, text: p.right }));
  }, [gameData]);

  function handleLeftClick(item) {
    if (matches.includes(item.id)) return;
    setSelectedLeft(item);
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  }

  function handleRightClick(item) {
    if (matches.includes(item.id)) return;
    setSelectedRight(item);
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  }

  function checkMatch(leftItem, rightItem) {
    if (leftItem.id === rightItem.id) {
      // Correct match!
      setMatches([...matches, leftItem.id]);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if game complete
      if (matches.length + 1 === gameData.pairs.length) {
        const score = matches.length + 1;
        setTimeout(() => onComplete({ score, correctMatches: score, totalPairs: gameData.pairs.length }), 800);
      }
    } else {
      // Incorrect match
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  }

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        <div className="text-2xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  const totalPairs = gameData.pairs.length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Animated Background Bubbles */}
      <FloatingBubbles count={40} />

      {/* Game Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Exit Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onExit}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </Button>
        </div>

        {/* Question */}
        <motion.h2
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {gameData.metadata?.question || 'Match the pairs!'}
        </motion.h2>

        {/* Progress */}
        <div className="text-center mb-6">
          <span className="text-xl font-semibold text-gray-700">
            {matches.length} / {totalPairs} pairs matched
          </span>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {showError && (
            <motion.div
              className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              Not a match! Try again.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bubbles Grid */}
        <div className="flex justify-center gap-12 max-w-6xl mx-auto">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {leftItems.map((item, index) => (
              <GameBubble
                key={index}
                item={item}
                color={bubbleColors[item.text]}
                isSelected={selectedLeft?.id === item.id}
                isMatched={matches.includes(item.id)}
                onClick={() => handleLeftClick(item)}
              />
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {rightItems.map((item, index) => (
              <GameBubble
                key={index}
                item={item}
                color={bubbleColors[item.text]}
                isSelected={selectedRight?.id === item.id}
                isMatched={matches.includes(item.id)}
                onClick={() => handleRightClick(item)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GameBubble({ item, color, isSelected, isMatched, onClick }) {
  return (
    <motion.div
      className={`
        relative w-48 h-48 rounded-full cursor-pointer
        flex items-center justify-center text-center
        border-4 transition-all duration-300
        ${isMatched ? 'opacity-30 cursor-not-allowed scale-90' : 'hover:scale-105'}
        ${isSelected ? 'border-white ring-4 ring-yellow-400 scale-110' : 'border-white/30'}
      `}
      style={{
        backgroundColor: color,
        boxShadow: `0 8px 32px ${color}60, inset 0 4px 12px rgba(255,255,255,0.3)`,
      }}
      onClick={isMatched ? undefined : onClick}
      whileHover={!isMatched ? { scale: 1.05 } : {}}
      whileTap={!isMatched ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: isMatched ? 0.9 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Inner shine */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 70%)',
        }}
      />

      {/* Text */}
      <span className="relative z-10 text-white font-bold text-lg px-4 drop-shadow-lg">
        {item.text}
      </span>

      {/* Matched checkmark */}
      {isMatched && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MatchingBubbleGame;
