import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, CircleX, Maximize } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const InterviewHeader = ({
  generateNewQuestion,
  endInterview,
  nextQuestionReady,
  interviewShouldEnd,
  warnings = 0,
  isFullscreen = false,
  onEnterFullscreen,
  onExitFullscreen,
}) => {
  const navigate = useNavigate();

  const handleEndInterview = async () => {
    try {
      if (onExitFullscreen) {
        await onExitFullscreen();
      }
      await endInterview();
      navigate('/portal');
    } catch (error) {
      console.error("Error ending interview:", error);
      navigate('/portal');
    }
  };

  return (
    <header className="sticky top-0 z-50 p-4 border-b border-white/10 backdrop-blur-2xl bg-slate-950/80 flex justify-between items-center text-slate-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_rgba(var(--destructive),0.5)]" />
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Interview Session
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {warnings > 0 ? (
            <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
              Warnings: {warnings}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
              Secure Environment
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isFullscreen && (
          <Button
            onClick={onEnterFullscreen}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-4 transition-all"
          >
            <Maximize className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold">Fullscreen</span>
          </Button>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleEndInterview}
                disabled={!interviewShouldEnd}
                variant="ghost"
                size="sm"
                className={`rounded-xl px-4 font-bold text-xs uppercase tracking-wider transition-all duration-500 ${interviewShouldEnd
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                  : "text-muted-foreground/20 cursor-not-allowed opacity-50"
                  }`}
              >
                End Interview
                <CircleX className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {!interviewShouldEnd && (
              <TooltipContent className="bg-popover border-border text-muted-foreground text-xs shadow-2xl">
                The interview is still in progress
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default InterviewHeader;