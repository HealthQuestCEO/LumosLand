// SlidingMatchGame.jsx
// Drag-and-drop sliding match game

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeMatchingData, validateMatchingData } from './MatchGameDataAdapter';
import FloatingBubbles from './FloatingBubbles';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function SlidingMatchGame({ lessonData, gameConfig, onComplete, onExit }) {
  const [gameData, setGameData] = useState(null);
  const [rightItems, setRightItems] = useState([]);
  const [matches, setMatches] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    try {
      const normalized = normalizeMatchingData(lessonData);
      const validation = validateMatchingData(normalized);

      if (!validation.valid) {
        console.error('[SlidingMatchGame] Invalid matching data:', validation.error);
        return;
      }

      setGameData(normalized);

      // Shuffle right items
      const shuffled = [...normalized.pairs.map(p => ({ id: p.id, text: p.right }))];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setRightItems(shuffled);
    } catch (error) {
      console.error('Error parsing sliding match game:', error);
    }
  }, [lessonData]);

  const leftItems = useMemo(() => {
    if (!gameData) return [];
    return gameData.pairs.map(p => ({ id: p.id, text: p.left }));
  }, [gameData]);

  function handleDragStart(rightItem) {
    setDraggedItem(rightItem);
  }

  function handleDrop(leftItem) {
    if (!draggedItem) return;

    if (leftItem.id === draggedItem.id) {
      const newMatches = { ...matches, [leftItem.id]: draggedItem.text };
      setMatches(newMatches);

      if (Object.keys(newMatches).length === gameData.pairs.length) {
        const score = Object.keys(newMatches).length;
        setTimeout(() => onComplete({ score, correctMatches: score, totalPairs: gameData.pairs.length }), 500);
      }
    }

    setDraggedItem(null);
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
      <FloatingBubbles count={40} />

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

        <motion.h2
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {gameData.metadata?.question || 'Drag and match the pairs!'}
        </motion.h2>

        <div className="text-center mb-6">
          <span className="text-xl font-semibold text-gray-700">
            {Object.keys(matches).length} / {totalPairs} pairs matched
          </span>
        </div>

        <div className="flex justify-center gap-12 max-w-6xl mx-auto">
          {/* LEFT SIDE - Drop zones */}
          <div className="flex flex-col gap-4">
            {leftItems.map((leftItem, index) => (
              <DropZone
                key={index}
                leftItem={leftItem}
                matchedText={matches[leftItem.id]}
                onDrop={() => handleDrop(leftItem)}
              />
            ))}
          </div>

          {/* RIGHT SIDE - Draggable items */}
          <div className="flex flex-col gap-4">
            {rightItems.map((rightItem, index) => {
              const isMatched = Object.values(matches).includes(rightItem.text);
              if (isMatched) return null;

              return (
                <DraggableCard
                  key={index}
                  item={rightItem}
                  onDragStart={() => handleDragStart(rightItem)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DropZone({ leftItem, matchedText, onDrop }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`
        relative w-64 h-24 rounded-xl border-4 border-dashed
        flex items-center justify-center transition-all
        ${matchedText ? 'bg-green-100 border-green-400' : 'bg-white/50 border-gray-300'}
        ${isOver ? 'border-blue-500 bg-blue-50' : ''}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsOver(false); onDrop(); }}
    >
      <div className="text-center px-4">
        <p className="font-bold text-gray-800">{leftItem.text}</p>
        {matchedText && (
          <motion.p
            className="text-green-600 font-semibold mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            → {matchedText}
          </motion.p>
        )}
      </div>
    </div>
  );
}

function DraggableCard({ item, onDragStart }) {
  return (
    <motion.div
      className="w-64 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl
                 flex items-center justify-center cursor-move shadow-lg
                 hover:shadow-xl transition-shadow"
      draggable
      onDragStart={onDragStart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <p className="text-white font-bold text-center px-4">{item.text}</p>
    </motion.div>
  );
}

export default SlidingMatchGame;
