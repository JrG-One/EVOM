import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{isUser ? "Me" : "mX"}</AvatarFallback>
        </Avatar>

        <Card className={`${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble;