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
  onEnterFullscreen
}) => {
  const navigate = useNavigate();
  return (
    <header className="p-4 border-b flex justify-between items-center bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Interview Session</h1>
        {warnings > 0 ? (
          <Badge variant="destructive" className="ml-2 animate-pulse">
            Warnings: {warnings}
          </Badge>
        ) : (
          <Badge variant="outline" className="ml-2">In Progress</Badge>
        )}
      </div>

      <div className="flex gap-3">
        {!isFullscreen && (
          <Button
            onClick={onEnterFullscreen}
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
          >
            <Maximize className="w-4 h-4 mr-2" />
            Enter Fullscreen
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={generateNewQuestion}
                disabled={!nextQuestionReady}
                variant={nextQuestionReady ? "default" : "outline"}
                className="transition-all duration-300"
              >
                Next Question
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {/* <TooltipContent>
              {nextQuestionReady 
                ? "Move to the next interview question" 
                : "Please complete the current question first"}
            </TooltipContent> */}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => endInterview(navigate('/'))}
                disabled={!interviewShouldEnd}
                variant={interviewShouldEnd ? "destructive" : "outline"}
                className="transition-all duration-300"
              >
                End Interview
                <CircleX className="ml-1 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {/* <TooltipContent>
              {interviewShouldEnd 
                ? "Complete the interview and view results" 
                : "Please complete all required questions first"}
            </TooltipContent> */}
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default InterviewHeader;