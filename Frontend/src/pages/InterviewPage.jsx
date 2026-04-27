import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ConversationPanel from "../components/interviewPage/ConservationPanel";
import ResponsePanel from "../components/interviewPage/ResponsePanel";
import CodeEditorWindow from "../components/CodeEditor/CodeEditorWindow";
import InterviewHeader from "../components/interviewPage/InterviewHeader";
import { useInterviewStore } from "../store/useInterviewStore";
import { useProctoring } from "@/hooks/useProctoring";

const InterviewPage = () => {
  const [defaultLayout, setDefaultLayout] = useState([50, 50]);
  const {
    nextQuestionReady,
    interviewShouldEnd,
    generateNewQuestion,
    generatingResponse,
    endInterview,
    currentQuestionType, // P2: Get type
  } = useInterviewStore();

  const { warnings, enterFullscreen, exitFullscreen, isFullscreen } = useProctoring();

  // Prompt for fullscreen on load
  React.useEffect(() => {
    // Optional: Try to enter fullscreen automatically or show a toast suggesting it
    enterFullscreen();
  }, [enterFullscreen]);

  // const time = new Date();
  // time.setSeconds(time.getSeconds() + 15);

  const handleAudioUnlock = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const unlock = new SpeechSynthesisUtterance("");
    unlock.volume = 0;
    window.speechSynthesis.speak(unlock);
  };

  return (
    <div
      className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden dark"
      onClick={handleAudioUnlock}
    >
      <InterviewHeader
        generateNewQuestion={generateNewQuestion}
        endInterview={endInterview}
        nextQuestionReady={nextQuestionReady}
        interviewShouldEnd={interviewShouldEnd}
        warnings={warnings}
        isFullscreen={isFullscreen}
        onEnterFullscreen={enterFullscreen}
        onExitFullscreen={exitFullscreen}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 bg-background"
        onLayout={(sizes) => setDefaultLayout(sizes)}
      >
        <ConversationPanel
          defaultSize={defaultLayout[0]}
          generatingResponse={generatingResponse}
        />

        {currentQuestionType === "CODING" ? (
          <>
            <ResizableHandle withHandle className="bg-border border-none w-[1.5px] hover:bg-primary/50 transition-colors" />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
              <CodeEditorWindow />
            </ResizablePanel>
          </>
        ) : (
          <ResponsePanel defaultSize={defaultLayout[1]} />
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default InterviewPage;
