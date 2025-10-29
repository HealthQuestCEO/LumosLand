import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * FloatingBubbles - Reusable animated background bubbles
 * Beautiful floating bubble effect with Lumo's Land colors
 * 
 * Usage:
 * <FloatingBubbles count={40} />
 */
export default function FloatingBubbles({ count = 40, colors = null }) {
  const defaultColors = [
    'rgba(102, 191, 173, 0.15)', // teal
    'rgba(17, 101, 179, 0.15)',  // blue
    'rgba(255, 164, 0, 0.15)',   // orange
    'rgba(0, 209, 255, 0.15)',   // cyan
  ];

  const bubbleColors = colors || defaultColors;

  const bubbles = useMemo(() => {
    return [...Array(count)].map((_, i) => {
      const size = 60 + Math.random() * 200;
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const startX = Math.random() * 100;
      const startY = 100 + Math.random() * 20;
      const duration = 15 + Math.random() * 20;
      const delay = Math.random() * 10;
      
      return {
        id: i,
        size,
        color,
        startX,
        startY,
        duration,
        delay
      };
    });
  }, [count, bubbleColors]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            left: `${bubble.startX}%`,
            bottom: `-${bubble.size}px`,
          }}
          animate={{
            y: [`0px`, `-${window.innerHeight + bubble.size + 100}px`],
            x: [`0px`, `${(Math.random() - 0.5) * 300}px`],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}