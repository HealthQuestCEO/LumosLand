import React from "react";
import BubbleGameSession from "./BubbleGameSession";
import PinMountainSession from "./PinMountainSession";
import GlassBridgeSession from "./GlassBridgeSession";
import MatchingBubbleGame from "./MatchingBubbleGame";
import SlidingMatchGame from "./SlidingMatchGame";
import ConnectDotsMatchGame from "./ConnectDotsMatchGame";

export default function GameSessionRouter({ lessonData, gameConfig, onComplete, onExit }) {
  console.log('🎮 GameSessionRouter:', {
    lessonId: lessonData?.id,
    name: lessonData?.name,
    type: lessonData?.type,
    game_style: lessonData?.game_style,
    is_assessment: lessonData?.is_assessment
  });

  // ✅ CRITICAL: ALL ASSESSMENTS must use Bubble Pop (ignore game_style)
  if (lessonData?.is_assessment) {
    console.log('📋 Assessment detected - forcing Bubble Pop format');
    
    if (lessonData.type === 'match' || lessonData.type === 'matching') {
      return <MatchingBubbleGame lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
    }
    
    return <BubbleGameSession lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
  }

  // For regular lessons (not assessments), game_style MUST be specified
  const gameStyle = lessonData?.game_style;
  const gameType = lessonData?.type || 'mcq';

  if (!gameStyle) {
    console.error('❌ ERROR: Regular lesson missing game_style!', lessonData);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-600 mb-4">This lesson is missing a game_style. Please contact an administrator.</p>
          <button
            onClick={onExit}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log(`🎯 Regular lesson - using game_style: ${gameStyle}, type: ${gameType}`);

  // MATCHING games - Route to appropriate matching game style
  if (gameType === 'match' || gameType === 'matching') {
    if (gameStyle === 'sliding_match') {
      console.log('🎴 Loading Sliding Match game');
      return <SlidingMatchGame lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
    }
    if (gameStyle === 'connect_dots') {
      console.log('🔗 Loading Connect Dots game');
      return <ConnectDotsMatchGame lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
    }
    if (gameStyle === 'bubble_pop') {
      console.log('💧 Loading Bubble Pop matching game');
      return <MatchingBubbleGame lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
    }
    
    // Invalid game_style for matching
    console.error(`❌ Invalid game_style "${gameStyle}" for matching game`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Game Style</h2>
          <p className="text-gray-600 mb-4">Game style "{gameStyle}" is not valid for matching games.</p>
          <button onClick={onExit} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // MCQ games - Pin Mountain and Glass Bridge are MCQ ONLY
  if (gameStyle === 'pin_mountain') {
    console.log('⛰️ Loading Pin Mountain (MCQ only)');
    return <PinMountainSession lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
  }
  
  if (gameStyle === 'glass_bridge') {
    console.log('🌉 Loading Glass Bridge (MCQ only)');
    return <GlassBridgeSession lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
  }

  if (gameStyle === 'bubble_pop') {
    console.log('💧 Loading Bubble Pop (MCQ)');
    return <BubbleGameSession lessonData={lessonData} gameConfig={gameConfig} onComplete={onComplete} onExit={onExit} />;
  }

  // Invalid game_style for MCQ
  console.error(`❌ Invalid game_style "${gameStyle}" for MCQ game`);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Game Style</h2>
        <p className="text-gray-600 mb-4">Game style "{gameStyle}" is not valid for MCQ games.</p>
        <button onClick={onExit} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
          Go Back
        </button>
      </div>
    </div>
  );
}