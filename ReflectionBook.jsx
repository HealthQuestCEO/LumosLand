import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, BookOpen, Pencil, Sparkles, Sticker } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JOURNAL_MODES = {
  QUESTIONS: "questions",
  FREE_WRITE: "free_write",
  STICKERS: "stickers"
};

export default function ReflectionBook({ user, lumoState, onUpdate, onClose }) {
  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [freeWriteContent, setFreeWriteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (mode === JOURNAL_MODES.QUESTIONS) {
      loadQuestions();
    }
  }, [mode]);

  const loadQuestions = async () => {
    try {
      const allQuestions = await base44.entities.ReflectionQuestion.filter({ is_active: true });
      
      // Get today's answered questions
      const today = new Date().toISOString().split('T')[0];
      const answeredToday = await base44.entities.ReflectionAnswer.filter({
        user_email: user.email,
        answer_date: today
      });
      
      const answeredQuestionIds = answeredToday.map(a => a.question_id);
      
      // Filter out already answered questions
      const unanswered = allQuestions.filter(q => !answeredQuestionIds.includes(q.question_id));
      
      // Sort by sort_order
      unanswered.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      
      setQuestions(unanswered);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      const question = questions[currentQuestionIndex];
      const xpEarned = 30;
      const coinsEarned = 15;

      await base44.entities.ReflectionAnswer.create({
        user_email: user.email,
        question_id: question.question_id,
        question_text: question.question_text,
        answer: answer.trim(),
        answer_date: new Date().toISOString().split('T')[0],
        xp_earned: xpEarned,
        coins_earned: coinsEarned
      });

      await base44.entities.LumoState.update(lumoState.id, {
        total_xp: lumoState.total_xp + xpEarned,
        total_coins: lumoState.total_coins + coinsEarned
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAnswer("");
        
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // All questions answered
          setMode(null);
        }
      }, 2000);

      await onUpdate();
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFreeWrite = async () => {
    if (!freeWriteContent.trim()) return;

    setIsSubmitting(true);
    try {
      const xpEarned = 30;
      const coinsEarned = 15;

      await base44.entities.ReflectionAnswer.create({
        user_email: user.email,
        question_id: `free_write_${Date.now()}`,
        question_text: "Free Write Entry",
        answer: freeWriteContent.trim(),
        answer_date: new Date().toISOString().split('T')[0],
        xp_earned: xpEarned,
        coins_earned: coinsEarned
      });

      await base44.entities.LumoState.update(lumoState.id, {
        total_xp: lumoState.total_xp + xpEarned,
        total_coins: lumoState.total_coins + coinsEarned
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFreeWriteContent("");
        setMode(null);
      }, 2000);

      await onUpdate();
    } catch (error) {
      console.error("Error submitting free write:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[#e0f8f5] to-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-4 border-[#66bfad]"
        >
          <div className="text-center">
            <div className="text-7xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-[#1165b3] mb-4">Great Job!</h3>
            <p className="text-lg text-gray-700">+30 XP, +15 Coins! 🎉</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-[#e0f8f5] to-white rounded-3xl shadow-2xl border-4 border-[#66bfad]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold text-[#1165b3] flex items-center gap-2">
                <BookOpen className="w-8 h-8" />
                Mood & Moves Journal
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <p className="text-gray-700 text-center text-lg mb-8">
              How would you like to express yourself today?
            </p>

            <div className="grid gap-4">
              <Button
                onClick={() => setMode(JOURNAL_MODES.QUESTIONS)}
                className="h-24 bg-gradient-to-r from-[#1165b3] to-[#66bfad] text-white text-lg flex items-center justify-center gap-3 hover:from-[#66bfad] hover:to-[#1165b3]"
              >
                <Sparkles className="w-6 h-6" />
                Answer Reflection Questions
              </Button>

              <Button
                onClick={() => setMode(JOURNAL_MODES.FREE_WRITE)}
                className="h-24 bg-gradient-to-r from-[#ffa400] to-[#ff8c00] text-white text-lg flex items-center justify-center gap-3 hover:from-[#ff8c00] hover:to-[#ffa400]"
              >
                <Pencil className="w-6 h-6" />
                Free Write
              </Button>

              <Button
                onClick={() => alert("Sticker kits coming soon! You'll be able to buy sticker packs from Lumo's Nook and decorate your journal pages! 🎨")}
                className="h-24 bg-gradient-to-r from-[#66bfad] to-[#00d1ff] text-white text-lg flex items-center justify-center gap-3"
              >
                <Sticker className="w-6 h-6" />
                Add Stickers & Drawings
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Coming Soon!</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === JOURNAL_MODES.QUESTIONS) {
    if (questions.length === 0) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-white rounded-3xl shadow-2xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold text-[#1165b3]">All Done! 🎉</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-gray-700 mb-4">You've answered all available questions for today!</p>
              <p className="text-sm text-gray-500">Come back tomorrow for more reflections, or try free write mode!</p>
              <Button
                onClick={() => setMode(null)}
                className="mt-6 bg-[#66bfad]"
              >
                Back to Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-[#e0f8f5] to-white rounded-3xl shadow-2xl border-4 border-[#66bfad]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-[#1165b3]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setMode(null)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="bg-white rounded-2xl p-6 border-2 border-[#66bfad]/30">
              <p className="text-lg font-semibold text-[#1165b3] mb-2">{currentQuestion.question_text}</p>
              {currentQuestion.hint && (
                <p className="text-sm text-gray-500 italic">💡 {currentQuestion.hint}</p>
              )}
            </div>

            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={8}
              className="text-base"
            />

            <div className="flex gap-4">
              <Button
                onClick={handleSubmitQuestion}
                disabled={!answer.trim() || isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white text-lg py-6"
              >
                {isSubmitting ? "Saving..." : "Submit Answer ✨"}
              </Button>
              {currentQuestionIndex < questions.length - 1 && (
                <Button
                  onClick={() => {
                    setAnswer("");
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }}
                  variant="outline"
                  className="px-8"
                >
                  Skip
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === JOURNAL_MODES.FREE_WRITE) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-[#e0f8f5] to-white rounded-3xl shadow-2xl border-4 border-[#66bfad]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-[#1165b3] flex items-center gap-2">
                <Pencil className="w-6 h-6" />
                Free Write
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setMode(null)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <p className="text-gray-700 text-center">
              Write whatever is on your mind. There are no rules - just express yourself! 📝
            </p>

            <Textarea
              value={freeWriteContent}
              onChange={(e) => setFreeWriteContent(e.target.value)}
              placeholder="Start writing..."
              rows={12}
              className="text-base"
            />

            <Button
              onClick={handleSubmitFreeWrite}
              disabled={!freeWriteContent.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-[#ffa400] to-[#ff8c00] text-white text-lg py-6"
            >
              {isSubmitting ? "Saving..." : "Save Entry ✨"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}