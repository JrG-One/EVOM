import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TextareaWithButton } from "../components/InterviewPage/TextInput";
import ChatInterface from "../components/InterviewPage/ChatInterface";
import useInterviewStore from "../store/useInterviewStore";
import { Button } from "../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Timer from "../components/InterviewPage/Timer";

const NewIntPage = () => {
  const navigate = useNavigate();
  const {
    nextQuestionReady,
    interviewShouldEnd,
    generateNewQuestion, // call this on button click
    endInterview,
  } = useInterviewStore();

  const time = new Date();
  time.setSeconds(time.getSeconds() + 15);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="p-2 flex gap-4 text-center justify-between bg-accent">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-md">IW</span>
        </div>
        <Timer expiryTimestamp={time} />
        <div className="flex gap-2">
          <Button
            onClick={generateNewQuestion}
            disabled={!nextQuestionReady}
            variant={nextQuestionReady ? "default" : "outline"}
          >
            Next Question
            <ChevronRight />
          </Button>

          <Button
            onClick={() => endInterview(navigate)}
            disabled={!interviewShouldEnd}
            variant={interviewShouldEnd ? "destructive" : "outline"}
          >
            End Interview
            <CircleX />
          </Button>
        </div>
      </div>
      <div className="flex flex-col m-auto items-center w-8/12 bg-gray-50 h-full">
        <ScrollArea className="h-full w-full">
          <ChatInterface />
        </ScrollArea>
        <TextareaWithButton />
      </div>
    </div>
  );
};

export default NewIntPage;
