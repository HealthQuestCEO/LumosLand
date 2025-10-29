
/**
 * Lesson Transformer
 * Converts current HealthQuest JSON format to HealthQuest Game Integration Spec format
 * 
 * Key Enhancement: Assigns ONE game style per lesson (not 3 duplicates)
 * - Assessments always use bubble_pop
 * - MCQ lessons get ONE of: [bubble_pop, pin_mountain, glass_bridge]
 * - Matching lessons get ONE of: [bubble_pop_match, sliding_match, connect_dots_match]
 */

/**
 * Detect what type of lesson this is
 */
function detectLessonType(lesson) {
  // Assessment types
  if (lesson.is_assessment) {
    if (lesson.assessment_type === 'pre') return 'pre_assessment';
    if (lesson.assessment_type === 'post') return 'post_assessment';
    if (lesson.assessment_type === 'reflection') return 'reflection';
    return 'assessment'; // generic
  }

  // Check question structure
  const hasQuestions = Array.isArray(lesson.questions) && lesson.questions.length > 0;
  
  if (!hasQuestions) {
    // Check if it's a top-level matching lesson (old format)
    if (lesson.type === 'match' && lesson.options) {
      return 'matching';
    }
    console.warn('⚠️ Lesson has no questions:', lesson);
    return 'unknown';
  }

  // Check first question type
  const firstQuestion = lesson.questions[0];
  
  if (firstQuestion.type === 'match' || firstQuestion.type === 'matching') {
    return 'matching';
  }
  
  if (firstQuestion.type === 'mcq') {
    return 'mcq';
  }
  
  // Likert scale (no type specified, but has score_mapping)
  if (lesson.score_mapping && !firstQuestion.type) {
    return 'likert';
  }

  return 'mcq'; // default
}

/**
 * Assign a single game style for regular lessons
 * Uses deterministic selection based on quest + lesson number
 */
function assignGameStyle(lesson, lessonType) {
  // If lesson already has game_style, keep it
  if (lesson.game_style) {
    return lesson.game_style;
  }

  // Assessments ALWAYS use bubble_pop
  if (lesson.is_assessment) {
    return 'bubble_pop';
  }

  // Use quest + number to deterministically pick a style
  const seed = `${lesson.quest}-${lesson.number}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Different game pools based on lesson type
  if (lessonType === 'matching') {
    // Matching games: bubble_pop_match, sliding_match, connect_dots_match
    const matchingStyles = ['bubble_pop_match', 'sliding_match', 'connect_dots_match'];
    const index = Math.abs(hash) % matchingStyles.length;
    return matchingStyles[index];
  } else {
    // MCQ games: bubble_pop, pin_mountain, glass_bridge
    const mcqStyles = ['bubble_pop', 'pin_mountain', 'glass_bridge'];
    const index = Math.abs(hash) % mcqStyles.length;
    return mcqStyles[index];
  }
}

/**
 * Determine gameType based on lesson properties
 */
function determineGameType(lesson) {
  const lessonType = detectLessonType(lesson);
  const gameStyle = assignGameStyle(lesson, lessonType);
  
  console.log('🔍 Determining gameType:', { lessonType, gameStyle });

  // Assessments ALWAYS use bubble_pop (regardless of gameStyle)
  if (lessonType === 'pre_assessment' || lessonType === 'post_assessment' || lessonType === 'reflection') {
    return 'bubble_pop_quiz';
  }

  // Matching games - gameStyle already includes the full type
  if (lessonType === 'matching') {
    return gameStyle; // Will be one of: bubble_pop_match, sliding_match, connect_dots_match
  }

  // MCQ games
  if (lessonType === 'mcq') {
    if (gameStyle === 'pin_mountain') return 'pin_mountain_quiz';
    if (gameStyle === 'glass_bridge') return 'glass_bridge_quiz';
    return 'bubble_pop_quiz';
  }

  // Likert scale (used in assessments)
  if (lessonType === 'likert') {
    return 'bubble_pop_quiz';
  }

  // Default
  return 'bubble_pop_quiz';
}

/**
 * Transform MCQ question from index-based answer to isCorrect flags
 */
function transformMCQQuestion(question, index) {
  const correctIndex = question.answer; // 1-based index

  return {
    questionId: question.questionId || `q${index + 1}`,
    questionText: question.question,
    questionType: 'mcq',
    options: question.options.map((optionText, optIdx) => ({
      id: `opt${optIdx + 1}`,
      text: optionText,
      isCorrect: (optIdx + 1) === correctIndex
    })),
    correctAnswer: `opt${correctIndex}`,
    rationale: question.rationale || null
  };
}

/**
 * Transform matching question from HealthQuest format
 */
function transformMatchingQuestion(lesson) {
  // Handle both old format (lesson.options) and new format (lesson.questions[0].options)
  const options = lesson.options || lesson.questions?.[0]?.options || [];
  const questionText = lesson.question || lesson.questions?.[0]?.question || "Match the pairs";

  return {
    questionId: 'match_q1',
    questionText: questionText,
    questionType: 'match',
    options: options // Keep original format for now, games know how to parse it
  };
}

/**
 * Transform Likert question (assessment)
 */
function transformLikertQuestion(question, scoreMapping, index) {
  return {
    questionId: question.questionId || `q${index + 1}`,
    questionText: question.question,
    questionType: 'likert',
    options: question.options.map((optionText, optIdx) => ({
      id: `opt${optIdx + 1}`,
      text: optionText,
      score: scoreMapping[optionText] || 0
    }))
  };
}

/**
 * Main transformation function
 * Converts lesson from current format → spec format
 */
export function transformLessonToSpecFormat(lesson) {
  console.log('🔄 Transforming lesson:', lesson.name);

  const lessonType = detectLessonType(lesson);
  const gameType = determineGameType(lesson);

  console.log('📊 Detected:', { lessonType, gameType });

  // Build transformed lesson
  const transformed = {
    lessonId: lesson.id || `${lesson.quest}-${lesson.number}`,
    questId: lesson.quest,
    lessonNumber: lesson.number,
    name: lesson.name,
    description: lesson.description,
    lessonText: lesson.lessonText || lesson.lesson_text || '',
    gameType: gameType,
    gameConfig: {
      variant: lessonType,
      theme: 'healthquest_default',
      difficulty: 'medium',
      timeLimit: null,
      showFeedback: true,
      allowRetry: true,
      ...lesson.gameConfig // Allow override if provided
    },
    questions: [],
    rewards: {
      xp: lesson.xp_total || lesson.xp_reward || 50,
      coins: lesson.coins_total || lesson.coins_reward || 50
    },
    keyTakeaways: lesson.keyTakeaways || null,
    feedback: lesson.feedback || null,
    is_assessment: lesson.is_assessment || false,
    assessment_type: lesson.assessment_type || null
  };

  // Transform questions based on type
  if (lessonType === 'matching') {
    // Single matching question
    transformed.questions = [transformMatchingQuestion(lesson)];
  } else if (lessonType === 'likert' || lessonType === 'pre_assessment' || lessonType === 'post_assessment') {
    // Likert scale questions
    transformed.questions = lesson.questions.map((q, idx) =>
      transformLikertQuestion(q, lesson.score_mapping, idx)
    );
    transformed.score_mapping = lesson.score_mapping;
    transformed.max_score = lesson.max_score;
  } else if (lessonType === 'mcq') {
    // MCQ questions
    transformed.questions = lesson.questions.map((q, idx) =>
      transformMCQQuestion(q, idx)
    );
  } else {
    console.warn('⚠️ Unknown lesson type, passing questions as-is');
    transformed.questions = lesson.questions || [];
  }

  console.log('✅ Transformation complete:', transformed);

  return transformed;
}

/**
 * Batch transform multiple lessons
 */
export function transformLessonsToSpecFormat(lessons) {
  return lessons.map(lesson => {
    try {
      return transformLessonToSpecFormat(lesson);
    } catch (error) {
      console.error('❌ Failed to transform lesson:', lesson.name, error);
      return null;
    }
  }).filter(Boolean);
}
