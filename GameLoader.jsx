import React from "react";
import BubbleGameSession from "./BubbleGameSession";
import PinMountainSession from "./PinMountainSession";
import GlassBridgeSession from "./GlassBridgeSession";
import MatchingBubbleGame from "./MatchingBubbleGame";
import SlidingMatchGame from "./SlidingMatchGame";
import ConnectDotsMatchGame from "./ConnectDotsMatchGame";

/**
 * GameLoader - Dynamically loads game components based on gameType
 * Following HealthQuest Game Integration Specification Section 4.2
 * 
 * This component acts as a factory that maps gameType strings to React components.
 * It ensures the frontend never hardcodes game-to-lesson mappings.
 */

// Game type registry - maps gameType strings to React components
const GAME_REGISTRY = {
  // MCQ Games (3 variants)
  'bubble_pop_quiz': BubbleGameSession,
  'pin_mountain_quiz': PinMountainSession,
  'glass_bridge_quiz': GlassBridgeSession,
  
  // Matching Games (3 variants)
  'bubble_pop_match': MatchingBubbleGame,
  'sliding_match': SlidingMatchGame,
  'connect_dots_match': ConnectDotsMatchGame,
  
  // Aliases for backward compatibility
  'bubble_pop': BubbleGameSession,
  'pin_mountain': PinMountainSession,
  'glass_bridge': GlassBridgeSession,
  'matching_cards': MatchingBubbleGame,
};

/**
 * Default fallback component for unknown game types
 */
function UnknownGameType({ lessonData, onExit }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Unknown Game Type
        </h2>
        <p className="text-gray-700 mb-2">
          Game type: <code className="bg-gray-100 px-2 py-1 rounded">{lessonData.gameType}</code>
        </p>
        <p className="text-gray-600 mb-6">
          This game type is not yet supported. Please contact support or try a different lesson.
        </p>
        <button
          onClick={onExit}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Back to Academy
        </button>
      </div>
    </div>
  );
}

/**
 * GameLoader Component
 * 
 * @param {Object} props
 * @param {Object} props.lessonData - Complete lesson data with gameType
 * @param {Object} props.gameConfig - Game configuration parameters
 * @param {Function} props.onComplete - Called when game completes
 * @param {Function} props.onExit - Called when user exits
 */
export default function GameLoader({ lessonData, gameConfig, onComplete, onExit }) {
  const gameType = lessonData?.gameType || 'bubble_pop_quiz';
  
  console.log('🎮 GameLoader:', {
    gameType,
    lessonId: lessonData?.lessonId,
    lessonName: lessonData?.name,
    hasGameConfig: !!gameConfig,
    availableGames: Object.keys(GAME_REGISTRY)
  });

  // Get the game component from registry
  const GameComponent = GAME_REGISTRY[gameType];

  // If game type is not found, show error component
  if (!GameComponent) {
    console.error('❌ Unknown game type:', gameType);
    return (
      <UnknownGameType 
        lessonData={lessonData} 
        onExit={onExit}
      />
    );
  }

  // Render the game component with standardized props
  return (
    <GameComponent
      lessonData={lessonData}
      gameConfig={gameConfig}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
}

/**
 * Register a new game type dynamically
 * Useful for plugins or A/B testing
 */
export function registerGameType(gameType, component) {
  console.log('📝 Registering new game type:', gameType);
  GAME_REGISTRY[gameType] = component;
}

/**
 * Get list of all available game types
 */
export function getAvailableGameTypes() {
  return Object.keys(GAME_REGISTRY);
}