
import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { normalizeMatchingData, validateMatchingData } from "./MatchGameDataAdapter";

// Color palette
const APP_COLORS = {
  primaryGreen: '#10b981',
  secondaryGreen: '#66bfad',
  primaryOrange: '#ffa400',
  secondaryOrange: '#ff8c00',
  primaryBlue: '#1165b3',
  darkText: '#374151',
  lightText: '#6b7280',
  hoverBlue: '#00d1ff',
};

const DOT_OFFSET = 4;

export default function ConnectDotsMatchGame({ lessonData, gameConfig, onComplete, onExit }) {
  // Normalize data using universal adapter
  const normalizedData = useMemo(() => {
    const normalized = normalizeMatchingData(lessonData);
    const validation = validateMatchingData(normalized);

    if (!validation.valid) {
      console.error('[ConnectDots] Invalid matching data:', validation.error);
    }

    return normalized;
  }, [lessonData]);

  const pairs = normalizedData.pairs;
  const metadata = normalizedData.metadata;
  const questionText = metadata.question || "Match the pairs!";
  
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrongMatch, setWrongMatch] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [celebrateMatch, setCelebrateMatch] = useState(null);
  const [matchedLines, setMatchedLines] = useState([]);

  const leftItems = useMemo(() => pairs.map(p => ({ id: p.id, text: p.left })), [pairs]);
  const rightItems = useMemo(() => pairs.map(p => ({ id: p.id, text: p.right })), [pairs]);

  const shuffledLeft = useMemo(() => [...leftItems].sort(() => Math.random() - 0.5), [leftItems]);
  const shuffledRight = useMemo(() => [...rightItems].sort(() => Math.random() - 0.5), [rightItems]);

  const uniqueMatchedPairs = useMemo(() => new Set(Object.values(matches)).size, [matches]);
  const allMatched = uniqueMatchedPairs === pairs.length && Object.keys(matches).length > 0;

  const leftItemRefs = useRef(new Map());
  const rightItemRefs = useRef(new Map());
  const gameAreaRef = useRef(null);

  const lumoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e72a9f947d6831aa76e519/0a40a0a5c_Happy13.png";

  useEffect(() => {
    const updateLines = () => {
      if (!gameAreaRef.current) return;
      
      const newLines = [];
      const gameRect = gameAreaRef.current.getBoundingClientRect();

      // Get unique pairs that are matched
      const matchedPairIds = new Set();
      Object.entries(matches).forEach(([leftId, rightId]) => {
        // Ensure that the 'id' stored in matches is the pair's original ID (p.id),
        // not the item's unique id (which is also p.id)
        // This relies on `matches` storing { pairId: pairId, ... }
        // The original logic `leftSelectedId === rightSelectedId` implies the pairId is the key and value.
        // So, if matches looks like { "pair_0": "pair_0", "pair_1": "pair_1" }, this is fine.
        // If it was { "leftItemAId": "rightItemBId" }, then this logic needs to find the actual pair ID.
        // Given how `handleItemClick` works: `setMatches({ ...matches, [leftSelectedId]: rightSelectedId, [rightSelectedId]: leftSelectedId });`
        // where `leftSelectedId` and `rightSelectedId` are both `item.id` (which is `p.id`),
        // this implies `matches` will store `pairId: pairId`.
        // So, `Object.entries(matches)` gives `[pairId, pairId]`.
        // The `leftItem` check is for robustness but `leftId` and `rightId` should be the same pair id.
        const leftItem = shuffledLeft.find(item => item.id === leftId);
        if (leftItem) {
          matchedPairIds.add(leftId); // Add the pair ID directly
        }
      });

      matchedPairIds.forEach(pairId => {
        // Find one of the items associated with this pairId from shuffledLeft to get its ref
        const leftItem = shuffledLeft.find(item => item.id === pairId);
        const rightItem = shuffledRight.find(item => item.id === pairId);
        
        const leftRef = leftItemRefs.current.get(leftItem?.id);
        const rightRef = rightItemRefs.current.get(rightItem?.id);

        if (leftRef && rightRef) {
          const leftRect = leftRef.getBoundingClientRect();
          const rightRect = rightRef.getBoundingClientRect();

          const leftCenter = {
            x: leftRect.right + DOT_OFFSET,
            y: leftRect.top + leftRect.height / 2
          };
          const rightCenter = {
            x: rightRect.left - DOT_OFFSET,
            y: rightRect.top + rightRect.height / 2
          };

          const lineLength = Math.sqrt(
            Math.pow(rightCenter.x - leftCenter.x, 2) +
            Math.pow(rightCenter.y - leftCenter.y, 2)
          );

          newLines.push({
            key: pairId, // Use pairId as key
            x1: leftCenter.x - gameRect.left,
            y1: leftCenter.y - gameRect.top,
            x2: rightCenter.x - gameRect.left,
            y2: rightCenter.y - gameRect.top,
            lineLength: lineLength
          });
        }
      });

      setMatchedLines(newLines);
    };

    updateLines();
    const timer = setTimeout(updateLines, 100);
    window.addEventListener('resize', updateLines);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateLines);
    };
  }, [matches, shuffledLeft, shuffledRight]);

  if (pairs.length === 0) {
    const validation = validateMatchingData(normalizedData);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">No Matching Pairs Found</h2>
          <p className="text-gray-600 mb-4">{validation.error || 'Please check the lesson data format.'}</p>
          <p className="text-sm text-gray-500 mb-4">Detected format: {normalizedData.format}</p>
          <button onClick={onExit} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Exit
          </button>
        </div>
      </div>
    );
  }

  const handleItemClick = (side, itemId) => {
    // If an item is already matched, or if trying to select a side that is already matched for this ID, do nothing.
    // The `matches` object stores `{ pairId: pairId }`.
    // So `matches[itemId]` checks if this `itemId` (which is a pairId) has been matched.
    if (matches[itemId]) return; 
    
    if (!selected) {
      setSelected({ side, itemId });
    } else {
      // If the same side is selected again, update selection to the new item on that side
      if (selected.side === side) {
        setSelected({ side, itemId });
      } else {
        const leftSelectedId = selected.side === 'left' ? selected.itemId : itemId;
        const rightSelectedId = selected.side === 'right' ? selected.itemId : itemId;
        
        // In our current setup, itemId IS the pairId. So leftSelectedId and rightSelectedId should be the same.
        // Example: if "pair_0" is selected on left, and then "pair_0" is selected on right, they match.
        // If "pair_0" is selected on left, and then "pair_1" on right, they do not match.
        const isCorrect = leftSelectedId === rightSelectedId;
        
        if (isCorrect) {
          // Store the pairId in matches. Example: { "pair_0": "pair_0" }
          // This allows checking `matches[item.id]` directly to see if the pair is completed.
          setMatches({ ...matches, [leftSelectedId]: leftSelectedId }); 
          setSelected(null);
          
          setCelebrateMatch({ leftId: leftSelectedId, rightId: rightSelectedId });
          setTimeout(() => setCelebrateMatch(null), 1000);
        } else {
          setWrongMatch({ leftId: leftSelectedId, rightId: rightSelectedId });
          setTimeout(() => {
            setWrongMatch(null);
            setSelected(null);
          }, 600);
        }
      }
    }
  };

  const handleComplete = () => {
    setShowFeedback(true);
    setTimeout(() => {
      onComplete({
        correctAnswers: pairs.length,
        totalQuestions: pairs.length,
        coinsEarned: metadata.coinsReward || 50,
        xpEarned: metadata.xpReward || 50
      });
    }, 2000);
  };

  const renderMatchItem = (item, side) => {
    const isMatched = !!matches[item.id];
    const isSelected = selected?.itemId === item.id;
    const isWrong = side === 'left' ? wrongMatch?.leftId === item.id : wrongMatch?.rightId === item.id;
    const isCelebrating = side === 'left' ? celebrateMatch?.leftId === item.id : celebrateMatch?.rightId === item.id;
    
    // Default neutral colors for unmatched/unselected items
    const defaultBorderColor = '#d1d5db'; // Tailwind gray-300
    const defaultDotColor = APP_COLORS.primaryBlue; // Primary blue for interactive dot

    const itemStyle = {
      backgroundColor: isMatched ? '#d1fae5' : isSelected ? APP_COLORS.primaryOrange : isWrong ? '#fee2e2' : 'white',
      borderColor: isMatched ? APP_COLORS.primaryGreen : isSelected ? APP_COLORS.secondaryOrange : isWrong ? '#ef4444' : defaultBorderColor
    };

    const dotStyle = {
      backgroundColor: isMatched ? APP_COLORS.primaryGreen : isSelected ? APP_COLORS.secondaryOrange : defaultDotColor,
      borderColor: 'white'
    };

    return (
      <div key={item.id} className="relative">
        <button
          ref={(el) => {
            if (side === 'left') {
              leftItemRefs.current.set(item.id, el);
            } else {
              rightItemRefs.current.set(item.id, el);
            }
          }}
          onClick={() => handleItemClick(side, item.id)}
          disabled={isMatched}
          className={`
            w-full aspect-square max-w-[120px] 
            ${side === 'left' ? 'ml-auto' : 'mr-auto'}
            relative rounded-2xl border-4 transition-all
            ${isMatched ? 'opacity-70' : ''}
            ${isSelected ? 'shadow-xl scale-105' : ''}
            ${!isMatched && !isSelected && !isWrong ? 'shadow-lg hover:scale-105' : ''}
          `}
          style={itemStyle}
        >
          {/* Lumo Image */}
          <div className={`absolute bottom-0 ${side === 'left' ? 'right-[-10px] scale-x-[-1]' : 'left-[-10px]'} w-16 h-16 z-20`}>
            <img 
              src={lumoUrl}
              alt="Lumo"
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-3 bg-white/80 rounded-xl m-2">
            <span className="text-xs font-bold text-center leading-tight" style={{ color: APP_COLORS.primaryBlue }}>
              {item.text}
            </span>
          </div>

          {/* Matching Dot */}
          <div 
            className={`absolute top-1/2 ${side === 'left' ? '-right-2' : '-left-2'} transform -translate-y-1/2 w-6 h-6 rounded-full border-4 z-10`}
            style={dotStyle}
          />
        </button>

        {/* Stars Celebration */}
        {isCelebrating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="absolute top-1/2 left-1/2 text-3xl"
              >
                ⭐
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-50 p-4 relative">
      {/* ✅ FIXED: Background bubbles with proper z-index and no overflow issues */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 80 + 40;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const duration = Math.random() * 10 + 8;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                backgroundColor: '#66bfad',
                opacity: 0.15,
                boxShadow: `inset 0 -4px 8px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.3)`,
              }}
              animate={{
                y: [0, -120, 0, 120, 0],
                x: [0, 60, 0, -60, 0],
                scale: [1, 1.3, 1, 0.7, 1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <div 
                className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full bg-white opacity-40"
                style={{ filter: 'blur(8px)' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto mb-6">
        <div className="bg-white shadow-sm rounded-2xl p-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={onExit} 
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-xl font-bold" style={{ color: APP_COLORS.darkText }}>Lumo's Match Quest</h1>
          <div className="flex items-center gap-2 text-white px-4 py-2 rounded-full font-bold" style={{ backgroundColor: APP_COLORS.secondaryGreen }}>
            🎯 {uniqueMatchedPairs}/{pairs.length}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="relative z-10 max-w-4xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
          style={{ border: `4px solid ${APP_COLORS.primaryBlue}` }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center" style={{ color: APP_COLORS.darkText }}>
            {questionText}
          </h2>
          <p className="text-center mt-2" style={{ color: APP_COLORS.lightText }}>
            Tap one box from each column to match the pairs!
          </p>
        </motion.div>
      </div>

      {/* ✅ FIXED: Game Area - scrollable, proper spacing, no overflow-hidden */}
      <div 
        ref={gameAreaRef}
        className="relative z-10 max-w-5xl mx-auto"
        style={{ 
          minHeight: `${Math.max(shuffledLeft.length, shuffledRight.length) * 110 + 200}px` // +200px buffer for line drawing
        }}
      >
        {/* SVG for drawing lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            zIndex: 5
          }}
        >
          {matchedLines.map((line, index) => (
            <motion.line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={APP_COLORS.secondaryGreen}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </svg>

        {/* Left Column */}
        <div className="absolute left-0 top-0 w-[45%]">
          {shuffledLeft.map((item) => (
            <div key={item.id} style={{ marginBottom: '16px' }}> {/* This div provides spacing */}
              {renderMatchItem(item, 'left')}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="absolute right-0 top-0 w-[45%]">
          {shuffledRight.map((item) => (
            <div key={item.id} style={{ marginBottom: '16px' }}> {/* This div provides spacing */}
              {renderMatchItem(item, 'right')}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Add padding at bottom for scrolling */}
      <div className="h-24"></div>

      {/* Complete Button */}
      {allMatched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md mx-auto mt-8"
        >
          <Button
            onClick={handleComplete}
            className="w-full text-white py-6 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl"
            style={{
              background: `linear-gradient(to right, ${APP_COLORS.primaryGreen}, ${APP_COLORS.secondaryGreen})`
            }}
          >
            ✨ Continue
          </Button>
        </motion.div>
      )}

      {/* Success Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: APP_COLORS.secondaryGreen }}>Perfect Match!</h2>
              <p className="text-xl" style={{ color: APP_COLORS.lightText }}>
                All pairs matched correctly!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
