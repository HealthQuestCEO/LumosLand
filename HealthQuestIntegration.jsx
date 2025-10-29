/**
 * HealthQuest Platform Integration
 *
 * Complete integration system for embedding LumosLand into HealthQuest
 * without requiring separate authentication or backend changes.
 *
 * This file provides:
 * 1. Authentication sync with HealthQuest
 * 2. Progress tracking sync
 * 3. Reward notifications
 * 4. Bi-directional communication
 */

import { useEffect, useCallback, useRef } from 'react';
import { useHealthQuestEmbed } from './HealthQuestEmbedBridge';

/**
 * Hook to sync lesson completion with HealthQuest
 */
export const useLessonSync = () => {
  const { notifyLessonComplete, embeddedUser, isEmbedded } = useHealthQuestEmbed();

  const syncLessonComplete = useCallback((lessonData) => {
    if (!isEmbedded) {
      console.log('[LessonSync] Not embedded, skipping HealthQuest sync');
      return;
    }

    const payload = {
      lessonId: lessonData.lessonId || lessonData.id,
      lessonNumber: lessonData.number,
      questName: lessonData.quest,
      score: lessonData.score || 100,
      correctAnswers: lessonData.correctAnswers,
      totalQuestions: lessonData.totalQuestions,
      completedAt: new Date().toISOString(),
      timeSpent: lessonData.timeSpent,
      gameStyle: lessonData.gameStyle,
      isAssessment: lessonData.isAssessment || false
    };

    notifyLessonComplete(payload);
    console.log('[LessonSync] Notified HealthQuest of lesson completion:', payload);
  }, [isEmbedded, notifyLessonComplete]);

  return { syncLessonComplete };
};

/**
 * Hook to sync rewards (XP, coins) with HealthQuest
 */
export const useRewardsSync = () => {
  const { notifyRewards, embeddedUser, isEmbedded } = useHealthQuestEmbed();

  const syncRewards = useCallback((rewardData) => {
    if (!isEmbedded) {
      console.log('[RewardsSync] Not embedded, skipping HealthQuest sync');
      return;
    }

    const payload = {
      xpEarned: rewardData.xpEarned || rewardData.xp || 0,
      coinsEarned: rewardData.coinsEarned || rewardData.coins || 0,
      source: rewardData.source || 'lesson',
      sourceId: rewardData.lessonId || rewardData.activityId,
      earnedAt: new Date().toISOString(),
      metadata: rewardData.metadata || {}
    };

    notifyRewards(payload);
    console.log('[RewardsSync] Notified HealthQuest of rewards:', payload);
  }, [isEmbedded, notifyRewards]);

  return { syncRewards };
};

/**
 * Hook to sync overall progress with HealthQuest
 */
export const useProgressSync = () => {
  const { notifyProgress, embeddedUser, isEmbedded } = useHealthQuestEmbed();

  const syncProgress = useCallback((progressData) => {
    if (!isEmbedded) {
      console.log('[ProgressSync] Not embedded, skipping HealthQuest sync');
      return;
    }

    const payload = {
      totalXP: progressData.totalXP || 0,
      totalCoins: progressData.totalCoins || 0,
      lessonsCompleted: progressData.lessonsCompleted || 0,
      currentQuest: progressData.currentQuest,
      lastActivity: new Date().toISOString(),
      lumoState: progressData.lumoState || {},
      achievements: progressData.achievements || []
    };

    notifyProgress(payload);
    console.log('[ProgressSync] Notified HealthQuest of progress:', payload);
  }, [isEmbedded, notifyProgress]);

  return { syncProgress };
};

/**
 * Combined integration hook - handles all HealthQuest sync
 */
export const useHealthQuestIntegration = () => {
  const { embeddedUser, isEmbedded, isReady } = useHealthQuestEmbed();
  const { syncLessonComplete } = useLessonSync();
  const { syncRewards } = useRewardsSync();
  const { syncProgress } = useProgressSync();

  // Log integration status
  useEffect(() => {
    if (isReady) {
      if (isEmbedded && embeddedUser) {
        console.log('[Integration] HealthQuest integration active', {
          userId: embeddedUser.userId,
          email: embeddedUser.email
        });
      } else {
        console.log('[Integration] Running in standalone mode');
      }
    }
  }, [isReady, isEmbedded, embeddedUser]);

  return {
    isEmbedded,
    isReady,
    user: embeddedUser,
    syncLessonComplete,
    syncRewards,
    syncProgress
  };
};

/**
 * Auto-sync wrapper component
 * Wrap your lesson/game components with this to enable auto-sync
 */
export const AutoSyncWrapper = ({ children, lessonData, onComplete }) => {
  const { syncLessonComplete, syncRewards } = useHealthQuestIntegration();
  const hasCompletedRef = useRef(false);

  const handleComplete = useCallback((completionData) => {
    // Prevent duplicate syncs
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Sync lesson completion
    syncLessonComplete({
      ...lessonData,
      ...completionData
    });

    // Sync rewards if present
    if (completionData.xpEarned || completionData.coinsEarned) {
      syncRewards({
        xpEarned: completionData.xpEarned,
        coinsEarned: completionData.coinsEarned,
        source: 'lesson',
        lessonId: lessonData.id || lessonData.number
      });
    }

    // Call original onComplete
    if (onComplete) {
      onComplete(completionData);
    }
  }, [lessonData, syncLessonComplete, syncRewards, onComplete]);

  return children({ onComplete: handleComplete });
};

/**
 * Format user data from HealthQuest for Firebase/Firestore
 */
export const formatUserForFirebase = (embeddedUser) => {
  if (!embeddedUser) return null;

  return {
    uid: embeddedUser.userId,
    email: embeddedUser.email,
    displayName: embeddedUser.displayName,
    photoURL: embeddedUser.photoURL,
    metadata: {
      ...embeddedUser.metadata,
      source: 'healthquest',
      sessionId: embeddedUser.sessionId
    }
  };
};

/**
 * Check if running in HealthQuest iframe
 */
export const isInHealthQuest = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true; // If we can't access parent, assume we're in iframe
  }
};

/**
 * Get HealthQuest configuration from URL params or parent
 */
export const getHealthQuestConfig = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    theme: params.get('theme') || 'default',
    hideNav: params.get('hideNav') === 'true',
    quest: params.get('quest'),
    lesson: params.get('lesson'),
    embedded: params.get('embedded') === 'true' || isInHealthQuest()
  };
};

export default useHealthQuestIntegration;
