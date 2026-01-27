import React from 'react';
import { Bot, User } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full mb-8 items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border backdrop-blur-md transition-transform duration-300 hover:scale-110 ${isUser
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:shadow-emerald-500/20"
          : "bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:shadow-purple-500/20"
        }`}>
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`relative px-5 py-4 rounded-3xl text-sm leading-relaxed backdrop-blur-xl border transition-all duration-300 ${isUser
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-50/90 rounded-tr-none shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            : "bg-white/[0.03] border-white/10 text-white/90 rounded-tl-none shadow-[0_0_20px_rgba(139,92,246,0.05)]"
          }`}>
          {/* Subtle Glow Corner */}
          <div className={`absolute top-0 ${isUser ? "right-0" : "left-0"} w-8 h-8 opacity-20 blur-xl ${isUser ? "bg-emerald-500" : "bg-purple-500"
            }`} />

          <p className="relative z-10 whitespace-pre-wrap font-medium tracking-wide">
            {message.content}
          </p>
        </div>

        {/* Timestamp/Role Label (Optional subtle detail) */}
        <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/20 px-1">
          {isUser ? "Candidate" : "Interview Whiz AI"}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;