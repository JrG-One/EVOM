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

  const { warnings, enterFullscreen, isFullscreen } = useProctoring();

  // Prompt for fullscreen on load
  React.useEffect(() => {
    // Optional: Try to enter fullscreen automatically or show a toast suggesting it
    // enterFullscreen(); 
  }, [enterFullscreen]);

  // const time = new Date();
  // time.setSeconds(time.getSeconds() + 15);

  return (
    <div className="h-screen flex flex-col bg-background">
      <InterviewHeader
        generateNewQuestion={generateNewQuestion}
        endInterview={endInterview}
        nextQuestionReady={nextQuestionReady}
        interviewShouldEnd={interviewShouldEnd}
        warnings={warnings}
        isFullscreen={isFullscreen}
        onEnterFullscreen={enterFullscreen}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
        onLayout={(sizes) => setDefaultLayout(sizes)}
      >
        <ConversationPanel
          defaultSize={defaultLayout[0]}
          generatingResponse={generatingResponse}
        />

        {currentQuestionType === "CODING" ? (
          <>
            <ResizableHandle withHandle />
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
