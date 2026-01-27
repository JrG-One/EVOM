import React from 'react';

const VoiceWaveform = ({ isListening }) => {
    if (!isListening) return null;

    return (
        <div className="flex items-center justify-center gap-[3px] h-8 px-4 bg-purple-500/10 rounded-full border border-purple-500/20 backdrop-blur-sm animate-in fade-in duration-500">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="w-[3px] bg-purple-400 rounded-full animate-waveform"
                    style={{
                        height: '100%',
                        animationDelay: `${i * 0.15}s`,
                    }}
                />
            ))}
            <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-purple-300/80">Listening...</span>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes waveform {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
        .animate-waveform {
          animation: waveform 0.8s ease-in-out infinite;
        }
      `}} />
        </div>
    );
};

export default VoiceWaveform;
