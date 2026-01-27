import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start items-center gap-4 mb-8 animate-in fade-in duration-500">
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-lg backdrop-blur-md">
        <Bot size={20} />
      </div>

      {/* Typing dots in glassmorphic card */}
      <div className="bg-white/[0.03] border border-white/10 px-5 py-4 rounded-3xl rounded-tl-none backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.05)]">
        <div className="flex gap-1.5 items-center h-5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-bounce duration-1000"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-bounce duration-1000 delay-150"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-bounce duration-1000 delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;