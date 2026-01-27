import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2, Mic, MicOff } from "lucide-react";
import { useInterviewStore } from "@/store/useInterviewStore";
import VoiceWaveform from "./VoiceWaveform";
import useVoiceInteraction from "@/hooks/useVoiceInteraction";

const ResponsePanel = ({ defaultSize = 50 }) => {
  const [userInput, setUserInput] = useState("");
  const { sendMessage, generatingResponse, isVoiceMode, setVoiceMode, isListening } = useInterviewStore();

  // Initialize voice interaction hook
  useVoiceInteraction();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setUserInput("");
  };

  return (
    <>
      <ResizableHandle withHandle className="bg-white/5 border-none w-1 hover:bg-purple-500/30 transition-colors" />

      <ResizablePanel defaultSize={Number(defaultSize)} minSize={30}>
        <div className="flex flex-col h-full bg-[#050505] border-l border-white/5 relative">
          {/* Subtle Side Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[80px] pointer-events-none" />

          <div className="p-6 border-b border-white/5 backdrop-blur-md bg-white/[0.01]">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 flex items-center">
              <Sparkles className="w-3 h-3 mr-2 text-purple-400" />
              Your Response
            </h2>
            <div className="absolute top-1/2 -translate-y-1/2 right-6">
              <VoiceWaveform isListening={isListening} />
            </div>
          </div>

          <div className="flex-1 flex flex-col p-8 relative z-10">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1 relative group">
                <Textarea
                  placeholder={isVoiceMode ? "Interviewer is listening... Speak your answer or type here." : "Draft your response here..."}
                  className="w-full h-full resize-none bg-transparent border-none text-white/90 placeholder:text-white/50 focus-visible:ring-0 p-0 text-lg leading-relaxed selection:bg-purple-500/30"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={generatingResponse}
                />

                {/* Visual indicator for typing area */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  {userInput.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500/50 transition-all duration-300"
                          style={{ width: `${Math.min((userInput.length / 500) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
                        {userInput.length} chars
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setVoiceMode(!isVoiceMode)}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${isVoiceMode
                      ? "bg-purple-600/20 border-purple-500/50 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    {isVoiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>

                  <Button
                    type="submit"
                    disabled={generatingResponse || !userInput.trim()}
                    className={`relative overflow-hidden group h-12 px-8 rounded-2xl font-bold transition-all duration-500 ${!userInput.trim()
                      ? "bg-white/5 text-white/20"
                      : "bg-gradient-to-tr from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                  >
                    <div className="flex items-center relative z-10">
                      {generatingResponse ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          Submit Response
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ResizablePanel>
    </>
  );
};

export default ResponsePanel;