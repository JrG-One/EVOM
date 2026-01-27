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
      <div className="flex flex-col h-full bg-[#030303] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/5 blur-[120px] rounded-full" />
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
            <WebcamPreview className="relative h-full w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl" />
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
};

export default ConversationPanel;