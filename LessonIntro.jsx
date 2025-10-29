import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function LessonIntro({ lesson, onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f8f5] to-[#66bfad]/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-3xl w-full"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[#1165b3]">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1165b3] to-[#66bfad] rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-[#1165b3]">
              {lesson.name}
            </CardTitle>
            {lesson.description && (
              <p className="text-gray-600 mt-2">{lesson.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-[#e0f8f5] to-[#00d1ff]/10 rounded-2xl p-6 border-2 border-[#66bfad]/30">
              <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                {lesson.lessonText}
              </p>
            </div>
            <Button
              onClick={onStart}
              className="w-full bg-gradient-to-r from-[#66bfad] to-[#1165b3] text-white py-6 text-lg rounded-2xl hover:shadow-xl transition-all"
            >
              Start Lesson
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}