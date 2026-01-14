import { ScrollArea } from "@/components/ui/scroll-area";
import useInterviewStore from "../../store/useInterviewStore";
import { useRef, useEffect } from "react";

const ChatInterface = () => {
  const { conversation, currentCoversationIndex } = useInterviewStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current && conversation) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);
  return (
    <div className="flex flex-col h-full w-full mx-auto p-4">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.slice(currentCoversationIndex).map((message, index) => (
            <div
              key={message.id || index}
              className={`flex items-start gap-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
              ref={messageEndRef}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-xs ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatInterface;
