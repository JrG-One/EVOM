import React from 'react';
import { Brain } from 'lucide-react';

const AIVisual = ({ isSpeaking, isListening }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 relative">
            {/* Background Glows */}
            <div className={`absolute inset-0 bg-purple-600/10 blur-[60px] rounded-full transition-opacity duration-1000 ${isSpeaking ? 'opacity-100' : 'opacity-40'}`} />
            <div className={`absolute inset-0 bg-blue-600/5 blur-[80px] rounded-full transition-opacity duration-1000 ${isListening ? 'opacity-100' : 'opacity-20'}`} />

            {/* Main Core */}
            <div className="relative z-10">
                <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl transition-all duration-700 ${isSpeaking ? 'scale-110 shadow-purple-500/50' : 'scale-100 shadow-purple-900/40'}`}>
                    <Brain className={`w-16 h-16 text-white transition-all duration-300 ${isSpeaking ? 'animate-pulse' : ''}`} />

                    {/* Orbital Rings */}
                    <div className={`absolute inset-0 border-2 border-white/20 rounded-[2.5rem] animate-ping opacity-20 ${isSpeaking ? 'duration-700' : 'duration-2000'}`} />
                    <div className="absolute -inset-4 border border-white/5 rounded-[3rem] animate-spin duration-[10s]" />
                </div>

                {/* Status Indicators */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className={`text-[11px] font-black uppercase tracking-[0.5em] transition-colors duration-500 ${isSpeaking ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : isListening ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : 'text-slate-500'}`}>
                        {isSpeaking ? 'Synthesizing' : isListening ? 'Processing' : 'Neural Core Active'}
                    </span>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-1 rounded-full transition-all duration-500 ${isSpeaking || isListening ? 'bg-purple-500 scale-125' : 'bg-white/10'}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: orbit 15s linear infinite;
        }
      `}} />
        </div>
    );
};

export default AIVisual;
