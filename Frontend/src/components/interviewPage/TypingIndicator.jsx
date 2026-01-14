import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 max-w-[80%]">
        <Avatar className="h-8 w-8 bg-muted">
          <AvatarFallback>mX</AvatarFallback>
        </Avatar>
        <Card className="bg-muted">
          <CardContent className="p-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TypingIndicator;