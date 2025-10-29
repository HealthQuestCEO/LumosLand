import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import GameLoader from "./GameLoader";
import LessonIntro from "./LessonIntro";
import TakeawaysScreen from "./TakeawaysScreen";
import RewardsScreen from "./RewardsScreen";
import { transformLessonToSpecFormat } from "./lessonTransformer";

/**
 * LessonGameContainer - Main container for playing a lesson
 * Following HealthQuest Game Integration Specification Section 4.2
 * 
 * Manages the complete lesson flow:
 * 1. Intro screen
 * 2. Game session
 * 3. Takeaways screen
 * 4. Rewards screen
 */

export default function LessonGameContainer({ lesson, user, onComplete, onExit }) {
  const [stage, setStage] = useState('intro'); // intro | playing | takeaways | rewards
  const [gameResults, setGameResults] = useState(null);
  const [transformedLesson, setTransformedLesson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Transform lesson to spec format
    try {
      const transformed = transformLessonToSpecFormat(lesson);
      setTransformedLesson(transformed);
      console.log('✅ Lesson transformed:', {
        original: lesson,
        transformed
      });
    } catch (err) {
      console.error('❌ Failed to transform lesson:', err);
      setError('Failed to load lesson data');
    }
  }, [lesson]);

  const handleStartGame = () => {
    setStage('playing');
  };

  const handleGameComplete = async (results) => {
    console.log('🎮 Game completed:', results);
    setGameResults(results);
    
    // Save lesson completion
    try {
      await saveLessonCompletion(results);
      
      // Show takeaways if available
      if (transformedLesson?.keyTakeaways) {
        setStage('takeaways');
      } else {
        setStage('rewards');
      }
    } catch (err) {
      console.error('❌ Failed to save lesson completion:', err);
      // Still show rewards even if save fails
      setStage('rewards');
    }
  };

  const handleGameExit = () => {
    // User exited mid-game
    onExit();
  };

  const handleTakeawaysContinue = () => {
    setStage('rewards');
  };

  const handleRewardsComplete = () => {
    onComplete(gameResults);
  };

  const saveLessonCompletion = async (results) => {
    const completionData = {
      user_email: user.email,
      lesson_id: lesson.id,
      quest_id: lesson.quest,
      lesson_number: lesson.number,
      score: results.correctAnswers || 0,
      total_questions: results.totalQuestions || 0,
      coins_earned: results.coinsEarned || 0,
      xp_earned: results.xpEarned || 0,
      completed_date: new Date().toISOString()
    };

    // Save to LessonCompletion entity
    await base44.entities.LessonCompletion.create(completionData);

    // Award XP and coins to LumoState
    const [lumoState] = await base44.entities.LumoState.filter({
      user_email: user.email
    });

    if (lumoState) {
      await base44.entities.LumoState.update(lumoState.id, {
        total_xp: lumoState.total_xp + (results.xpEarned || 0),
        total_coins: lumoState.total_coins + (results.coinsEarned || 0)
      });
    }
  };

  // Error state
  if (error || !transformedLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Failed to Load Lesson
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to transform lesson data'}
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

  // Render current stage
  if (stage === 'intro') {
    return (
      <LessonIntro
        lesson={transformedLesson}
        onStart={handleStartGame}
        onExit={onExit}
      />
    );
  }

  if (stage === 'playing') {
    return (
      <GameLoader
        lessonData={transformedLesson}
        gameConfig={transformedLesson.gameConfig}
        onComplete={handleGameComplete}
        onExit={handleGameExit}
      />
    );
  }

  if (stage === 'takeaways') {
    return (
      <TakeawaysScreen
        lesson={transformedLesson}
        onContinue={handleTakeawaysContinue}
      />
    );
  }

  if (stage === 'rewards') {
    return (
      <RewardsScreen
        lesson={transformedLesson}
        results={gameResults}
        onComplete={handleRewardsComplete}
      />
    );
  }

  return null;
}