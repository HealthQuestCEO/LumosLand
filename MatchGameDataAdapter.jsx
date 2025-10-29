/**
 * Universal Match Game Data Adapter
 *
 * This adapter normalizes ALL possible JSON formats from HealthQuest
 * into a consistent format for match games WITHOUT requiring backend changes.
 *
 * Supported Formats:
 * 1. Base44 String Format: {ans: "text", matching_answer: "text"}
 * 2. HealthQuest Object Format: {ans: "text", matching_answer: {answerId: "id", group: "left"/"right"}}
 * 3. Nested Object Format: {ques: {text: "..."}, ans: {text: "..."}}
 * 4. Simple Pair Format: {question: "text", answer: "text"}
 * 5. Array of Pairs: [{left: "text", right: "text"}]
 * 6. Mixed nested structures with any combination
 */

/**
 * Deep text extraction - recursively finds text in nested objects
 */
function extractText(value, depth = 0) {
  // Prevent infinite recursion
  if (depth > 10) return '';

  // Handle null/undefined
  if (value === null || value === undefined) return '';

  // If it's already a string, return it
  if (typeof value === 'string') return value.trim();

  // If it's a number, convert to string
  if (typeof value === 'number') return String(value);

  // If it's a boolean, convert to string
  if (typeof value === 'boolean') return value ? 'True' : 'False';

  // If it's an array, try first non-empty element
  if (Array.isArray(value)) {
    for (const item of value) {
      const extracted = extractText(item, depth + 1);
      if (extracted) return extracted;
    }
    return '';
  }

  // If it's an object, try common text property names first
  if (typeof value === 'object') {
    // Priority list of property names
    const textProps = [
      'text', 'displayText', 'content', 'label', 'value', 'title',
      'name', 'description', 'question', 'answer', 'ques', 'ans',
      'q', 'a', 'left', 'right', 'option', 'choice'
    ];

    // Try each property in order
    for (const prop of textProps) {
      if (value[prop]) {
        const extracted = extractText(value[prop], depth + 1);
        if (extracted) return extracted;
      }
    }

    // If no common properties, try all string values
    for (const key of Object.keys(value)) {
      const extracted = extractText(value[key], depth + 1);
      if (extracted) return extracted;
    }
  }

  // Last resort: stringify
  try {
    const str = String(value);
    return str !== '[object Object]' ? str : '';
  } catch {
    return '';
  }
}

/**
 * Parse Format 1: Base44 String Format
 * Example: [{ans: "Eyes", matching_answer: "Sight"}]
 */
function parseBase44StringFormat(options) {
  const pairs = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (!option.matching_answer || typeof option.matching_answer !== 'string') {
      continue;
    }

    const left = extractText(option.ans || option.ques || option.question);
    const right = extractText(option.matching_answer);

    if (left && right) {
      pairs.push({
        id: `pair_${i}`,
        left,
        right,
        originalIndex: i
      });
    }
  }

  return pairs;
}

/**
 * Parse Format 2: HealthQuest Object Format
 * Example: [{ans: "Eyes", matching_answer: {answerId: "1", group: "left"}}]
 */
function parseHealthQuestObjectFormat(options) {
  const pairsMap = new Map();

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (!option.matching_answer?.answerId) {
      continue;
    }

    const answerId = option.matching_answer.answerId;
    const group = option.matching_answer.group;
    const text = extractText(option.ans || option.ques || option.question || option);

    if (!text) continue;

    if (!pairsMap.has(answerId)) {
      pairsMap.set(answerId, { id: answerId, originalIndex: i });
    }

    const pair = pairsMap.get(answerId);

    if (group === 'left' || group === 'Left' || group === 'LEFT') {
      pair.left = text;
    } else if (group === 'right' || group === 'Right' || group === 'RIGHT') {
      pair.right = text;
    } else {
      // If no group specified, try to infer from order
      if (!pair.left) {
        pair.left = text;
      } else if (!pair.right) {
        pair.right = text;
      }
    }
  }

  // Filter out incomplete pairs
  return Array.from(pairsMap.values())
    .filter(pair => pair.left && pair.right);
}

/**
 * Parse Format 3: Simple Pair Format
 * Example: [{question: "Eyes", answer: "Sight"}] or [{ques: {...}, ans: {...}}]
 */
function parseSimplePairFormat(options) {
  const pairs = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    // Try multiple possible property names
    const left = extractText(
      option.question || option.ques || option.q ||
      option.left || option.prompt || option.term
    );

    const right = extractText(
      option.answer || option.ans || option.a ||
      option.right || option.response || option.definition ||
      option.matching_answer
    );

    if (left && right) {
      pairs.push({
        id: `pair_${i}`,
        left,
        right,
        originalIndex: i
      });
    }
  }

  return pairs;
}

/**
 * Parse Format 4: Direct Pair Array
 * Example: [{left: "Eyes", right: "Sight"}]
 */
function parseDirectPairFormat(options) {
  const pairs = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    const left = extractText(option.left);
    const right = extractText(option.right);

    if (left && right) {
      pairs.push({
        id: `pair_${i}`,
        left,
        right,
        originalIndex: i
      });
    }
  }

  return pairs;
}

/**
 * Detect the format type
 */
function detectFormat(options) {
  if (!Array.isArray(options) || options.length === 0) {
    return 'unknown';
  }

  const firstOption = options[0];

  // Format 4: Direct pairs with left/right
  if (firstOption.left !== undefined && firstOption.right !== undefined) {
    return 'direct-pair';
  }

  // Format 2: HealthQuest Object Format
  if (firstOption.matching_answer?.answerId !== undefined) {
    return 'healthquest-object';
  }

  // Format 1: Base44 String Format
  if (firstOption.matching_answer && typeof firstOption.matching_answer === 'string') {
    return 'base44-string';
  }

  // Format 3: Simple Pair Format
  if (firstOption.question || firstOption.answer ||
      firstOption.ques || firstOption.ans ||
      firstOption.q || firstOption.a) {
    return 'simple-pair';
  }

  return 'unknown';
}

/**
 * Main adapter function - normalizes any format
 */
export function normalizeMatchingData(lessonData) {
  console.log('[MatchAdapter] Normalizing lesson data:', lessonData);

  // Extract options array from various possible locations
  let options = [];

  if (Array.isArray(lessonData)) {
    options = lessonData;
  } else if (lessonData?.questions?.[0]?.options) {
    options = lessonData.questions[0].options;
  } else if (lessonData?.questions?.[0]?.pairs) {
    options = lessonData.questions[0].pairs;
  } else if (lessonData?.options) {
    options = lessonData.options;
  } else if (lessonData?.pairs) {
    options = lessonData.pairs;
  } else if (lessonData?.data) {
    options = lessonData.data;
  } else if (lessonData?.matchingPairs) {
    options = lessonData.matchingPairs;
  } else if (lessonData?.items) {
    options = lessonData.items;
  }

  if (!Array.isArray(options) || options.length === 0) {
    console.warn('[MatchAdapter] No valid options array found');
    return {
      pairs: [],
      format: 'unknown',
      metadata: extractMetadata(lessonData)
    };
  }

  // Detect format and parse accordingly
  const format = detectFormat(options);
  console.log('[MatchAdapter] Detected format:', format);

  let pairs = [];

  switch (format) {
    case 'direct-pair':
      pairs = parseDirectPairFormat(options);
      break;
    case 'healthquest-object':
      pairs = parseHealthQuestObjectFormat(options);
      break;
    case 'base44-string':
      pairs = parseBase44StringFormat(options);
      break;
    case 'simple-pair':
      pairs = parseSimplePairFormat(options);
      break;
    default:
      // Try all parsers and use the one that returns most pairs
      const attempts = [
        parseDirectPairFormat(options),
        parseHealthQuestObjectFormat(options),
        parseBase44StringFormat(options),
        parseSimplePairFormat(options)
      ];
      pairs = attempts.reduce((best, current) =>
        current.length > best.length ? current : best, []
      );
  }

  console.log('[MatchAdapter] Parsed pairs:', pairs);

  // Validate pairs
  const validPairs = pairs.filter(pair => {
    if (!pair.left || !pair.right) {
      console.warn('[MatchAdapter] Invalid pair (missing left or right):', pair);
      return false;
    }
    if (pair.left === pair.right) {
      console.warn('[MatchAdapter] Invalid pair (left equals right):', pair);
      return false;
    }
    return true;
  });

  console.log(`[MatchAdapter] Valid pairs: ${validPairs.length}/${pairs.length}`);

  return {
    pairs: validPairs,
    format,
    metadata: extractMetadata(lessonData)
  };
}

/**
 * Extract metadata from lesson data
 */
function extractMetadata(lessonData) {
  if (!lessonData || typeof lessonData !== 'object') {
    return {};
  }

  return {
    title: extractText(lessonData.title || lessonData.name || lessonData.lessonName),
    description: extractText(lessonData.description || lessonData.desc),
    question: extractText(lessonData.question || lessonData.questionText || lessonData.instructions),
    quest: lessonData.quest,
    number: lessonData.number,
    gameStyle: lessonData.game_style || lessonData.gameStyle,
    gameFormat: lessonData.game_format || lessonData.gameFormat,
    xpReward: lessonData.xp_reward || lessonData.xpReward || 50,
    coinsReward: lessonData.coins_reward || lessonData.coinsReward || 50,
    isAssessment: lessonData.is_assessment || lessonData.isAssessment || false,
    keyTakeaways: lessonData.keyTakeaways || lessonData.key_takeaways
  };
}

/**
 * Validate normalized data
 */
export function validateMatchingData(normalizedData) {
  if (!normalizedData) {
    return { valid: false, error: 'No data provided' };
  }

  if (!Array.isArray(normalizedData.pairs)) {
    return { valid: false, error: 'Pairs is not an array' };
  }

  if (normalizedData.pairs.length === 0) {
    return { valid: false, error: 'No valid pairs found. Check your JSON format.' };
  }

  const invalidPairs = normalizedData.pairs.filter(
    pair => !pair.left || !pair.right || pair.left === pair.right
  );

  if (invalidPairs.length > 0) {
    return {
      valid: false,
      error: `${invalidPairs.length} pairs are invalid`,
      invalidPairs
    };
  }

  return {
    valid: true,
    pairCount: normalizedData.pairs.length,
    format: normalizedData.format
  };
}

/**
 * Helper to convert old format to new format (for migration)
 */
export function convertLegacyFormat(legacyData) {
  console.log('[MatchAdapter] Converting legacy format');
  return normalizeMatchingData(legacyData);
}

export default normalizeMatchingData;
