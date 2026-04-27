import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

export function AIAgentDownModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Our AI Agent is currently down. Please try again later.");

  useEffect(() => {
    const handleAIDown = (e) => {
      if (e.detail?.error) {
        setMessage(e.detail.error);
      }
      setIsOpen(true);
    };

    window.addEventListener("ai-agent-down", handleAIDown);
    return () => window.removeEventListener("ai-agent-down", handleAIDown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-6 h-6" />
            AI Service Unavailable
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-gray-700 dark:text-gray-300">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Acknowledge
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
