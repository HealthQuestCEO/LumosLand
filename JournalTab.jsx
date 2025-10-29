import React from "react";
import ReflectionBook from "./ReflectionBook";

export default function JournalTab({ user, lumoState, activityLog, onUpdate, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ReflectionBook 
        user={user} 
        lumoState={lumoState} 
        onUpdate={onUpdate} 
        onClose={onBack}
      />
    </div>
  );
}