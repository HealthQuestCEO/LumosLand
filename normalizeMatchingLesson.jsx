/**
 * Normalize Matching Lesson Data
 * Handles both nested objects {ques: {text: "..."}, ans: {text: "..."}}
 * and simple strings/objects
 */

/**
 * Safely extract text from a value that could be:
 * - A string: "Eyes"
 * - An object with text property: {text: "Eyes"}
 * - An object itself: {"value": "Eyes"}
 */
function extractText(value) {
  if (!value) return '';
  
  // If it's already a string, return it
  if (typeof value === 'string') {
    return value;
  }
  
  // If it's an object with a 'text' property, return that
  if (typeof value === 'object' && value.text) {
    return value.text;
  }
  
  // If it's an object with a 'value' property, return that
  if (typeof value === 'object' && value.value) {
    return value.value;
  }
  
  // If it's an object but no text/value, try to stringify it meaningfully
  if (typeof value === 'object') {
    // Check if it has any string values we can extract
    const stringValue = Object.values(value).find(v => typeof v === 'string');
    if (stringValue) return stringValue;
  }
  
  // Last resort: convert to string
  return String(value);
}

/**
 * Normalize a single matching pair
 */
function normalizePair(pair, index) {
  if (!pair) {
    console.warn(`Pair at index ${index} is null or undefined`);
    return null;
  }

  // Extract question and answer, handling nested structures
  const question = extractText(pair.ques || pair.question || pair.q);
  const answer = extractText(pair.ans || pair.answer || pair.a);

  if (!question || !answer) {
    console.warn(`Pair at index ${index} is missing question or answer:`, pair);
    return null;
  }

  return {
    id: index,
    question,
    answer,
    matched: false
  };
}

/**
 * Main normalization function for matching lessons
 */
export function normalizeMatchingLesson(lessonData) {
  if (!lessonData) {
    console.error('No lesson data provided to normalizeMatchingLesson');
    return { pairs: [], metadata: {} };
  }

  // Handle different possible data structures
  let pairsArray = [];
  
  // Check various possible locations for the pairs data
  if (Array.isArray(lessonData)) {
    pairsArray = lessonData;
  } else if (lessonData.pairs && Array.isArray(lessonData.pairs)) {
    pairsArray = lessonData.pairs;
  } else if (lessonData.questions && Array.isArray(lessonData.questions)) {
    pairsArray = lessonData.questions;
  } else if (lessonData.data && Array.isArray(lessonData.data)) {
    pairsArray = lessonData.data;
  } else if (lessonData.matchingPairs && Array.isArray(lessonData.matchingPairs)) {
    pairsArray = lessonData.matchingPairs;
  }

  // Normalize all pairs
  const normalizedPairs = pairsArray
    .map((pair, index) => normalizePair(pair, index))
    .filter(pair => pair !== null); // Remove any invalid pairs

  console.log(`Normalized ${normalizedPairs.length} matching pairs:`, normalizedPairs);

  // Return normalized data with metadata
  return {
    pairs: normalizedPairs,
    metadata: {
      title: lessonData.title || lessonData.name || 'Matching Game',
      description: lessonData.description || '',
      totalPairs: normalizedPairs.length,
      gameType: lessonData.gameType || 'matching',
      difficulty: lessonData.difficulty || 'medium'
    }
  };
}

/**
 * Validate normalized lesson data
 */
export function validateMatchingLesson(normalizedData) {
  if (!normalizedData || !normalizedData.pairs) {
    return { valid: false, error: 'Missing pairs data' };
  }

  if (normalizedData.pairs.length === 0) {
    return { valid: false, error: 'No valid pairs found' };
  }

  const invalidPairs = normalizedData.pairs.filter(
    pair => !pair.question || !pair.answer
  );

  if (invalidPairs.length > 0) {
    return { 
      valid: false, 
      error: `${invalidPairs.length} pairs have missing question or answer` 
    };
  }

  return { valid: true, pairCount: normalizedData.pairs.length };
}

export default normalizeMatchingLesson;