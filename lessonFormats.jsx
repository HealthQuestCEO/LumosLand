// EXACT JSON FORMATS EXPECTED BY LUMO'S LAND
// Use these templates to create your JSON parser

export const LESSON_FORMATS = {
  
  // ===== PRE-ASSESSMENT (Likert Scale) =====
  PRE_ASSESSMENT: {
    "quest": "kindnesscrusaders",
    "number": 0,
    "name": "Pre-Assessment: Kindness Knowledge",
    "description": "Let's see what you already know about kindness",
    "lessonText": "Answer these questions honestly. There are no wrong answers - we just want to see what you know now!",
    "game_format": "likert",
    "game_style": "bubble_pop",
    "is_assessment": true,
    "assessment_type": "pre",
    "xp_reward": 0,
    "coins_reward": 0,
    "coins_per_correct": 0,
    "keyTakeaways": "",
    "is_active": true,
    "max_score": 20,
    "score_mapping": {
      "Strongly Disagree": 1,
      "Disagree": 2,
      "Neutral": 3,
      "Agree": 4,
      "Strongly Agree": 5
    },
    "questions": [
      {
        "question": "I know what kindness means",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        "question": "I can name ways to be kind to others",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        "question": "I understand how kindness makes people feel",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        "question": "I practice kindness every day",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      }
    ],
    "feedback": {
      "high_score": {
        "min": 16,
        "message": "Great! You already know a lot about kindness. Let's learn even more!"
      },
      "medium_score": {
        "min": 10,
        "max": 15,
        "message": "Good start! You're on your way to becoming a kindness expert."
      },
      "low_score": {
        "max": 9,
        "message": "That's okay! This quest will help you learn all about kindness."
      }
    }
  },

  // ===== MCQ LESSON WITH RATIONALES =====
  MCQ_LESSON: {
    "quest": "kindnesscrusaders",
    "number": 1,
    "name": "What is Kindness?",
    "description": "Learn the meaning of kindness",
    "lessonText": "Kindness means being friendly, generous, and considerate. When we're kind, we think about how others feel and try to make them happy. Kindness can be as simple as a smile, helping someone, or saying something nice!",
    "game_format": "mcq",
    "game_style": "bubble_pop",
    "is_assessment": false,
    "xp_reward": 50,
    "coins_reward": 50,
    "coins_per_correct": 10,
    "keyTakeaways": "Kindness is about caring for others and making them feel good. Small acts of kindness can make a big difference!",
    "is_active": true,
    "questions": [
      {
        "question": "What does kindness mean?",
        "options": [
          "Being mean to others",
          "Being friendly and caring",
          "Ignoring people",
          "Only thinking about yourself"
        ],
        "answer": 2,
        "rationale": {
          "correct": "Yes! Kindness means being friendly and caring about others.",
          "incorrect": {
            "1": "No, being mean is the opposite of kindness.",
            "3": "No, ignoring people isn't kind. Kindness is about showing you care.",
            "4": "No, kindness is thinking about others, not just yourself."
          }
        }
      },
      {
        "question": "Which is an example of kindness?",
        "options": [
          "Helping a friend with homework",
          "Taking someone's toy",
          "Laughing when someone falls",
          "Not sharing your snacks"
        ],
        "answer": 1,
        "rationale": {
          "correct": "Perfect! Helping a friend is a wonderful act of kindness.",
          "incorrect": {
            "2": "No, taking someone's toy without asking isn't kind.",
            "3": "No, laughing at someone who's hurt isn't kind. We should help them instead.",
            "4": "No, sharing is a great way to show kindness!"
          }
        }
      },
      {
        "question": "How does kindness make people feel?",
        "options": [
          "Sad and lonely",
          "Angry and upset",
          "Happy and cared for",
          "Scared and worried"
        ],
        "answer": 3,
        "rationale": {
          "correct": "Exactly! Kindness makes people feel happy and cared for.",
          "incorrect": {
            "1": "No, kindness makes people feel good, not sad!",
            "2": "No, kindness helps calm anger, it doesn't create it.",
            "4": "No, kindness makes people feel safe and valued, not scared."
          }
        }
      },
      {
        "question": "Can kindness be shown with words?",
        "options": [
          "No, only with gifts",
          "Yes, by saying nice things",
          "No, words don't matter",
          "Only on special occasions"
        ],
        "answer": 2,
        "rationale": {
          "correct": "Yes! Kind words are powerful. A compliment or encouragement can brighten someone's day.",
          "incorrect": {
            "1": "No, kindness doesn't require gifts. Words and actions are just as important!",
            "3": "Words matter a lot! Kind words can make someone's whole day better.",
            "4": "We can show kindness with words anytime, not just on special days!"
          }
        }
      },
      {
        "question": "Who can you be kind to?",
        "options": [
          "Only your best friends",
          "Only people you know",
          "Everyone you meet",
          "Only people who are kind to you first"
        ],
        "answer": 3,
        "rationale": {
          "correct": "Amazing! We can be kind to everyone - friends, family, strangers, and even people we don't get along with.",
          "incorrect": {
            "1": "We can be kind to more than just our best friends!",
            "2": "We can be kind to strangers too! A smile or holding a door open are simple acts of kindness.",
            "4": "We can be kind first! We don't have to wait for others to be kind to us."
          }
        }
      }
    ]
  },

  // ===== MATCHING LESSON (5 PAIRS) =====
  MATCHING_LESSON: {
    "quest": "kindnesscrusaders",
    "number": 2,
    "name": "Matching Kindness Actions",
    "description": "Match the situation to the kind action",
    "lessonText": "Sometimes we see situations where someone needs help or kindness. Let's practice matching situations with kind actions we can take!",
    "game_format": "matching",
    "game_style": "bubble_pop",
    "is_assessment": false,
    "xp_reward": 50,
    "coins_reward": 50,
    "coins_per_correct": 10,
    "keyTakeaways": "There are many ways to show kindness! We can help, share, include, comfort, and encourage others.",
    "is_active": true,
    "questions": [
      {
        "question": "Match the situation to the kind action",
        "options": [
          {
            "ans": "A classmate drops their books",
            "matching_answer": "Help pick them up"
          },
          {
            "ans": "Someone is sitting alone at lunch",
            "matching_answer": "Invite them to sit with you"
          },
          {
            "ans": "A friend is feeling sad",
            "matching_answer": "Give them a hug or listen"
          },
          {
            "ans": "Your sibling is struggling with homework",
            "matching_answer": "Offer to help explain it"
          },
          {
            "ans": "Someone did something really well",
            "matching_answer": "Give them a compliment"
          }
        ]
      }
    ]
  },

  // ===== POST-ASSESSMENT (Same questions as pre, likert scale) =====
  POST_ASSESSMENT: {
    "quest": "kindnesscrusaders",
    "number": 101,
    "name": "Post-Assessment: Kindness Knowledge",
    "description": "Let's see what you've learned about kindness!",
    "lessonText": "Answer these questions again. Let's see how much you've learned!",
    "game_format": "likert",
    "game_style": "bubble_pop",
    "is_assessment": true,
    "assessment_type": "post",
    "xp_reward": 0,
    "coins_reward": 0,
    "coins_per_correct": 0,
    "keyTakeaways": "",
    "is_active": true,
    "max_score": 20,
    "score_mapping": {
      "Strongly Disagree": 1,
      "Disagree": 2,
      "Neutral": 3,
      "Agree": 4,
      "Strongly Agree": 5
    },
    "questions": [
      {
        "question": "I know what kindness means",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        "question": "I can name ways to be kind to others",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        "question": "I understand how kindness makes people feel",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        "question": "I practice kindness every day",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      }
    ],
    "feedback": {
      "high_score": {
        "min": 16,
        "message": "Amazing growth! You're now a kindness expert! 🌟"
      },
      "medium_score": {
        "min": 10,
        "max": 15,
        "message": "Great job! You've learned so much about kindness!"
      },
      "low_score": {
        "max": 9,
        "message": "Good effort! Keep practicing kindness every day!"
      }
    }
  },

  // ===== REFLECTION/FEEDBACK FORM (Open-ended) =====
  FEEDBACK_FORM: {
    "quest": "kindnesscrusaders",
    "number": 102,
    "name": "Reflection: Your Kindness Journey",
    "description": "Share your thoughts about what you learned",
    "lessonText": "Take a moment to think about your kindness journey. Your honest thoughts help us make this even better!",
    "game_format": "reflection",
    "game_style": "bubble_pop",
    "is_assessment": false,
    "xp_reward": 30,
    "coins_reward": 20,
    "coins_per_correct": 0,
    "keyTakeaways": "Reflecting on what we learn helps us remember and grow!",
    "is_active": true,
    "questions": [
      {
        "question": "What was your favorite lesson in this quest?",
        "type": "open_text",
        "placeholder": "Tell us which lesson you enjoyed most..."
      },
      {
        "question": "Name one act of kindness you want to try this week",
        "type": "open_text",
        "placeholder": "I will be kind by..."
      },
      {
        "question": "How did learning about kindness make you feel?",
        "type": "multiple_choice",
        "options": ["Happy", "Inspired", "Thoughtful", "Excited", "Other"]
      },
      {
        "question": "What was the hardest part of this quest?",
        "type": "open_text",
        "placeholder": "Share any challenges you faced..."
      },
      {
        "question": "Would you recommend this quest to a friend?",
        "type": "multiple_choice",
        "options": ["Yes, definitely!", "Yes, probably", "Maybe", "Probably not", "No"]
      }
    ]
  }
};

// METADATA THAT MUST BE IN EVERY LESSON:
export const REQUIRED_METADATA = {
  "quest": "string - quest identifier (e.g., 'kindnesscrusaders', 'focusandfeel')",
  "number": "number - 0=pre-assessment, 1-100=lessons, 101=post-assessment, 102=feedback",
  "name": "string - display name of lesson",
  "description": "string - short description",
  "lessonText": "string - intro text shown before game",
  "game_format": "string - 'mcq', 'matching', 'likert', or 'reflection'",
  "game_style": "string - 'bubble_pop', 'pin_mountain', or 'glass_bridge'",
  "is_assessment": "boolean - true for pre/post assessments",
  "assessment_type": "string - 'pre', 'post', or 'reflection' (only if is_assessment=true)",
  "xp_reward": "number - XP earned for completion",
  "coins_reward": "number - Coins earned for completion",
  "coins_per_correct": "number - Coins per correct answer (0 for assessments)",
  "keyTakeaways": "string - summary message at end",
  "is_active": "boolean - whether lesson is available"
};

// FULL QUEST EXAMPLE (All lessons in order)
export const FULL_QUEST_EXAMPLE = [
  // Pre-assessment (number: 0)
  {
    "quest": "kindnesscrusaders",
    "number": 0,
    "name": "Pre-Assessment",
    "game_format": "likert",
    "is_assessment": true,
    "assessment_type": "pre",
    // ... full pre-assessment structure
  },
  
  // Lesson 1 (number: 1) - MCQ
  {
    "quest": "kindnesscrusaders",
    "number": 1,
    "name": "What is Kindness?",
    "game_format": "mcq",
    "is_assessment": false,
    // ... full MCQ structure with rationales
  },
  
  // Lesson 2 (number: 2) - Matching
  {
    "quest": "kindnesscrusaders",
    "number": 2,
    "name": "Matching Kindness Actions",
    "game_format": "matching",
    "is_assessment": false,
    // ... full matching structure with 5 pairs
  },
  
  // Lessons 3-20 would go here...
  
  // Post-assessment (number: 101)
  {
    "quest": "kindnesscrusaders",
    "number": 101,
    "name": "Post-Assessment",
    "game_format": "likert",
    "is_assessment": true,
    "assessment_type": "post",
    // ... same questions as pre-assessment
  },
  
  // Feedback form (number: 102)
  {
    "quest": "kindnesscrusaders",
    "number": 102,
    "name": "Reflection",
    "game_format": "reflection",
    "is_assessment": false,
    // ... feedback form structure
  }
];