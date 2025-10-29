
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Gift, AlertCircle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Body language hints for second attempt
const BODY_LANGUAGE_HINTS = {
  happy: "Lumo's eyes are crinkly like small smiles, and he might be wiggling his tail fast.",
  brave: "Lumo is standing very straight with his chin lifted. He's looking forward, ready for action!",
  confident: "Lumo has a calm, easy smile. He is standing tall and isn't looking down.",
  content: "Lumo's face has a soft, gentle smile. His body is relaxed and resting peacefully.",
  angry: "Look how Lumo's eyebrows are pushed down low. He is clutching his fists tightly.",
  sad: "Lumo's mouth is curved down. He is hunched over and his eyes look wet.",
  sleepy: "Lumo's eyes are heavy and his mouth is yawning a little. He needs a soft spot to rest.",
  playful: "Lumo has a silly, wide grin. He is bouncing or wiggling his body, ready to tease!",
  anxious: "Lumo's eyes are wide and darting. He is shaking a little and his tail is tucked in.",
  hungry: "Lumo looks tired and weak. Can you see the tummy rumbling lines on his belly?",
  thirsty: "Lumo's tongue is hanging out, and he is panting and sweating. He desperately needs water!",
  dirty: "Look at the mud spots and dust cloud around him. He needs a bath!"
};

// Nook item recommendations
const NOOK_RECOMMENDATIONS = {
  thirsty: {
    message: "I'm panting and sweating! I need Clear Spring Water from The Nook, or I'll run out of juice!",
    itemType: "physical",
    treats: "thirst"
  },
  hungry: {
    message: "My tummy is rumbling! Head to The Nook and find some Golden Fruit! It's super filling.",
    itemType: "physical",
    treats: "hunger"
  },
  dirty: {
    message: "Ugh, I'm covered in mud! Find the Bubble Wash Kit in The Nook so I can get clean and shiny again.",
    itemType: "physical",
    treats: "cleanliness"
  }
};

// All guessable options
const ALL_OPTIONS = ["happy", "brave", "confident", "content", "angry", "sad", "sleepy", "playful", "anxious", "thirsty", "hungry", "dirty"];

export default function EmotionIdentificationGame({ lumoState, activityLog, onCorrectGuess, onGuess }) {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(1);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  // Get current display state (order: thirst > hunger > hygiene > emotion)
  const getCurrentState = () => {
    if (!lumoState) return "content";
    
    // Check physical needs in priority order: THIRST, HUNGER, HYGIENE
    if (lumoState.thirst < 50) return "thirsty";
    if (lumoState.hunger < 50) return "hungry";
    if (lumoState.cleanliness < 50) return "dirty";
    
    // All needs met, show emotion
    return lumoState.current_emotion_state === "neutral" ? "content" : (lumoState.current_emotion_state || "content");
  };

  const currentState = getCurrentState();
  const isPhysicalNeed = currentState === "thirsty" || currentState === "hungry" || currentState === "dirty";

  // Check daily caps - 15 coins max, 45 XP max for care loop
  const careLoopXpToday = activityLog?.care_loop_xp_today || 0;
  const careLoopCoinsToday = activityLog?.care_loop_coins_today || 0;
  const xpCapReached = careLoopXpToday >= 45; // 3 correct guesses max
  const coinCapReached = careLoopCoinsToday >= 15; // 3 correct guesses max
  const dailyCapReached = xpCapReached && coinCapReached;

  // Check if this state was already guessed correctly today
  const guessedStatesToday = activityLog?.guessed_states_today || [];
  const alreadyGuessedThisState = guessedStatesToday.includes(currentState);

  const handleGuess = async (guessedState) => {
    if (wasCorrect !== null || showReveal) return;

    onGuess(); // Track attempt

    const correct = guessedState === currentState;
    setWasCorrect(correct);

    if (correct) {
      // Award 5 coins and 15 XP per correct guess (max 3 per day)
      if (!alreadyGuessedThisState && (!xpCapReached || !coinCapReached)) {
        await onCorrectGuess(currentState);
      }
    } else {
      // Incorrect guess
      if (attempt === 1) {
        // Show hint for attempt 2
        setTimeout(() => {
          setWasCorrect(null);
          setShowHint(true);
          setAttempt(2);
        }, 2000);
      } else {
        // Attempt 2 failed - reveal answer
        setTimeout(() => {
          setWasCorrect(null);
          setShowReveal(true);
        }, 2000);
      }
    }
  };

  const handleReset = () => {
    setAttempt(1);
    setWasCorrect(null);
    setShowHint(false);
    setShowReveal(false);
  };

  const formatStateName = (state) => {
    if (state === "dirty") return "Needs a Bath";
    if (state === "thirsty") return "Thirsty";
    if (state === "hungry") return "Hungry";
    return state.charAt(0).toUpperCase() + state.slice(1);
  };

  const goToNook = () => {
    navigate(createPageUrl("LumosNook") + `?need=${currentState}`);
  };

  return (
    <div className="rounded-xl mt-0 p-4 border-2 border-[var(--color-border-blue)]">
      <h3 className="text-sky-700 mb-4 text-lg font-bold text-center">Lumo Check-In: Feelings & Needs</h3>
      
      {alreadyGuessedThisState && wasCorrect === null && !showReveal && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-700">
          <Check className="h-4 w-4" />
          <AlertDescription>
            <strong>Fantastic job!</strong> You've already helped Lumo with this feeling today. While there are no extra rewards, you can still visit The Nook if Lumo needs something!
          </AlertDescription>
        </Alert>
      )}

      {dailyCapReached && wasCorrect === null && !showReveal && !alreadyGuessedThisState && (
        <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-700">
          <Gift className="h-4 w-4" />
          <AlertDescription>
            <strong>Wow, you're amazing!</strong> You've earned all your Lumo care rewards for today. Check back tomorrow for more fun!
          </AlertDescription>
        </Alert>
      )}

      {showHint && !wasCorrect && !showReveal && (
        <Alert className="mb-4 bg-blue-100 border-blue-300 text-blue-800">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Here's a little clue to help Lumo:</strong> {BODY_LANGUAGE_HINTS[currentState]}
          </AlertDescription>
        </Alert>
      )}

      {wasCorrect === null && !showReveal && (
        <div className="grid grid-cols-3 gap-2">
          {ALL_OPTIONS.map((option) => (
            <Button
              key={option}
              className="capitalize rounded-lg h-auto py-2 text-xs sm:text-sm whitespace-normal text-center leading-tight bg-white border-2 border-[var(--color-border-blue)]/50 hover:bg-white hover:border-[var(--color-border-blue)] text-[var(--color-border-blue)] transition-all shadow-sm"
              onClick={() => handleGuess(option)}
            >
              {formatStateName(option)}
            </Button>
          ))}
        </div>
      )}

      {wasCorrect === true && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="font-semibold text-green-700">
            You got it! {(!alreadyGuessedThisState && !dailyCapReached) && "+15 XP, +5 Coins!"}
          </p>
          {alreadyGuessedThisState && (
            <p className="text-sm text-blue-600">You already earned rewards for this one today!</p>
          )}
          {!alreadyGuessedThisState && dailyCapReached && (
            <p className="text-sm text-orange-600">You've hit your daily care loop rewards cap, but great job!</p>
          )}
          {isPhysicalNeed && NOOK_RECOMMENDATIONS[currentState] && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              💬 <strong>Lumo says:</strong> {NOOK_RECOMMENDATIONS[currentState].message}
            </div>
          )}
          <Button
            onClick={goToNook}
            className="bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-orange)]/80 text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Visit the Nook!
          </Button>
        </motion.div>
      )}

      {wasCorrect === false && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="font-semibold text-red-700">Not quite! Try again...</p>
        </motion.div>
      )}

      {showReveal && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
          <p className="font-semibold text-blue-700">
            Lumo is <strong>{formatStateName(currentState)}</strong>!
          </p>
          {isPhysicalNeed && NOOK_RECOMMENDATIONS[currentState] && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              💬 <strong>Lumo says:</strong> {NOOK_RECOMMENDATIONS[currentState].message}
            </div>
          )}
          <Button
            onClick={goToNook}
            className="bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-accent-orange)]/80 text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Visit the Nook!
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full">
            Try Again Later
          </Button>
        </motion.div>
      )}
    </div>
  );
}
