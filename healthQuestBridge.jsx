/**
 * HealthQuest API Bridge - Updated for Real Integration
 * Connects Lumo's Land to HealthQuest Firebase backend
 */

import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { normalizeMatchingLesson, validateMatchingLesson } from './normalizeMatchingLesson';

// HealthQuest API URL from environment
const HEALTHQUEST_API_URL = import.meta.env.VITE_API_SERVER_URL || "https://api-dev.discoverhealthquest.com";

/**
 * Fetch lesson from HealthQuest API
 */
export async function fetchLessonFromAPI(lessonId) {
  try {
    const response = await fetch(`${HEALTHQUEST_API_URL}/lessons/${lessonId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from HealthQuest API:', error);
    throw error;
  }
}

/**
 * Fetch lesson from Firestore directly
 */
export async function fetchLessonFromFirestore(lessonId) {
  try {
    const lessonRef = doc(db, 'lessons', lessonId);
    const lessonSnap = await getDoc(lessonRef);

    if (!lessonSnap.exists()) {
      throw new Error(`Lesson ${lessonId} not found in Firestore`);
    }

    return {
      id: lessonSnap.id,
      ...lessonSnap.data()
    };
  } catch (error) {
    console.error('Error fetching from Firestore:', error);
    throw error;
  }
}

/**
 * Fetch lessons by quest from Firestore
 */
export async function fetchLessonsByQuest(questId) {
  try {
    const lessonsRef = collection(db, 'lessons');
    const q = query(lessonsRef, where('questId', '==', questId));
    const querySnapshot = await getDocs(q);

    const lessons = [];
    querySnapshot.forEach((doc) => {
      lessons.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return lessons;
  } catch (error) {
    console.error('Error fetching lessons by quest:', error);
    throw error;
  }
}

/**
 * Main import function - tries multiple sources
 */
export async function importMatchingLesson(lessonId, source = 'auto') {
  try {
    console.log(`📦 Importing matching lesson: ${lessonId} (source: ${source})`);

    let rawData;

    // Try different data sources based on configuration
    if (source === 'api' || source === 'auto') {
      try {
        rawData = await fetchLessonFromAPI(lessonId);
        console.log('✅ Fetched from HealthQuest API');
      } catch (apiError) {
        console.warn('⚠️ API fetch failed, trying Firestore...', apiError.message);
        
        if (source === 'auto') {
          rawData = await fetchLessonFromFirestore(lessonId);
          console.log('✅ Fetched from Firestore');
        } else {
          throw apiError;
        }
      }
    } else if (source === 'firestore') {
      rawData = await fetchLessonFromFirestore(lessonId);
      console.log('✅ Fetched from Firestore');
    } else if (source === 'local') {
      // Fallback to local JSON file
      const response = await fetch(`/lessons/${lessonId}.json`);
      rawData = await response.json();
      console.log('✅ Fetched from local file');
    }

    console.log('📦 Raw lesson data:', rawData);

    // Normalize the data to handle nested structures
    const normalizedData = normalizeMatchingLesson(rawData);
    
    // Validate the normalized data
    const validation = validateMatchingLesson(normalizedData);
    
    if (!validation.valid) {
      throw new Error(`Invalid lesson data: ${validation.error}`);
    }

    console.log(`✅ Successfully imported ${validation.pairCount} matching pairs`);
    
    return normalizedData;

  } catch (error) {
    console.error('❌ Error importing matching lesson:', error);
    throw error;
  }
}

/**
 * Import lessons for Adventure Academy games
 * Supports: Bubble Pop, Pin Mountain, Glass Bridge
 */
export async function importAdventureAcademyLesson(gameType, lessonId, source = 'auto') {
  try {
    console.log(`🎮 Loading ${gameType} lesson ${lessonId}`);
    
    const lessonData = await importMatchingLesson(lessonId, source);
    
    // Add game-specific metadata
    return {
      ...lessonData,
      metadata: {
        ...lessonData.metadata,
        gameType,
        lessonId
      }
    };

  } catch (error) {
    console.error(`❌ Error loading ${gameType} lesson:`, error);
    throw error;
  }
}

/**
 * Fetch user's coin balance from HealthQuest
 */
export async function getUserCoins(userId) {
  try {
    const response = await fetch(`${HEALTHQUEST_API_URL}/users/${userId}/coins`, {
      headers: {
        'Content-Type': 'application/json',
        // Add auth header
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }

    const data = await response.json();
    return data.coins || 0;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    
    // Fallback to Firestore
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data().coins || 0;
      }
    } catch (firestoreError) {
      console.error('Firestore fallback failed:', firestoreError);
    }
    
    return 0;
  }
}

/**
 * Update user's progress after completing a lesson
 */
export async function syncLessonCompletion(userId, lessonId, score) {
  try {
    const response = await fetch(`${HEALTHQUEST_API_URL}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        score,
        completedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to sync lesson completion');
    }

    console.log(`✅ Synced lesson completion: ${lessonId}`);
    return await response.json();

  } catch (error) {
    console.error('Error syncing lesson completion:', error);
    throw error;
  }
}

/**
 * Get user's progress from HealthQuest
 */
export async function getUserProgress(userId) {
  try {
    const response = await fetch(`${HEALTHQUEST_API_URL}/users/${userId}/progress`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user progress');
    }

    return await response.json();

  } catch (error) {
    console.error('Error fetching user progress:', error);
    
    // Fallback to Firestore
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data().progress || {};
      }
    } catch (firestoreError) {
      console.error('Firestore fallback failed:', firestoreError);
    }
    
    return {};
  }
}

/**
 * Cache management
 */
const lessonCache = new Map();

export async function getLessonById(lessonId, gameType = 'matching', source = 'auto') {
  const cacheKey = `${gameType}-${lessonId}`;
  
  // Check cache first
  if (lessonCache.has(cacheKey)) {
    console.log(`📦 Returning cached lesson: ${cacheKey}`);
    return lessonCache.get(cacheKey);
  }

  // Import and cache
  const lesson = await importAdventureAcademyLesson(gameType, lessonId, source);
  lessonCache.set(cacheKey, lesson);
  
  return lesson;
}

export function clearLessonCache() {
  lessonCache.clear();
  console.log('🗑️ Lesson cache cleared');
}

// Export all functions
export default {
  importMatchingLesson,
  importAdventureAcademyLesson,
  fetchLessonFromAPI,
  fetchLessonFromFirestore,
  fetchLessonsByQuest,
  getUserCoins,
  syncLessonCompletion,
  getUserProgress,
  getLessonById,
  clearLessonCache
};