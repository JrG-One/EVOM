import React, { useRef, useEffect } from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useInterviewStore } from "@/store/useInterviewStore";
import WebcamPreview from './WebcamPreview';


const ConversationPanel = ({ defaultSize, generatingResponse }) => {
  const { conversation, currentCoversationIndex } = useInterviewStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <ResizablePanel defaultSize={Number(defaultSize) || 50} minSize={30}>
      <div className="flex flex-col h-full bg-muted/20">
        {/* Fixed Header */}
        <div className="p-3 border-b bg-background">
          <h2 className="text-sm font-medium">Conversation</h2>
        </div>

        {/* Webcam Preview */}
        <div className="p-3 border-b bg-background/50">
          <WebcamPreview className="w-full max-w-[240px] h-auto mx-auto shadow-md" />
        </div>

        {/* Scrollable Message Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-2">
            <div className="space-y-4 pb-20">
              {conversation.slice(currentCoversationIndex).map((message, index) => (
                <MessageBubble
                  key={message.id || index}
                  message={message}
                />
              ))}

              {generatingResponse && <TypingIndicator />}
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </ResizablePanel>
  );
};

export default ConversationPanel;