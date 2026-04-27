import React, { useRef, useEffect } from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useInterviewStore } from "@/store/useInterviewStore";
import WebcamPreview from './WebcamPreview';
import AIVisual from './AIVisual';

const ConversationPanel = ({ defaultSize, generatingResponse }) => {
  const { conversation, currentCoversationIndex, isSpeaking, isListening } = useInterviewStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <ResizablePanel defaultSize={Number(defaultSize) || 50} minSize={30} className="relative">
      <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden">
        {/* Advanced Neural Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse duration-[10s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:32px_32px]"></div>
        </div>

        {/* Scrollable Message Area */}
        <div className="flex-1 overflow-hidden relative z-10">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto px-6 py-10 space-y-2">
              {/* AI Visual Presence */}
              <div className="mb-12">
                <AIVisual isSpeaking={isSpeaking} isListening={isListening} />
              </div>

              {conversation.slice(currentCoversationIndex).map((message, index) => (
                <MessageBubble
                  key={message.id || index}
                  message={message}
                />
              ))}

              {generatingResponse && (
                <div className="pl-14">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messageEndRef} className="h-24" />
            </div>
          </ScrollArea>
        </div>

        {/* Floating Webcam Preview */}
        <div className="absolute bottom-6 right-6 z-20 w-56 h-36 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-1000 group/webcam">
          <div className="relative h-full w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <WebcamPreview className="relative h-full w-full rounded-2xl border border-border overflow-hidden shadow-2xl" />
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
};

export default ConversationPanel;