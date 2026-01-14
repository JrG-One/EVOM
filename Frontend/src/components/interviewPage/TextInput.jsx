import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useInterviewStore from "../../store/useInterviewStore";
import { SendIcon } from "lucide-react";

export function TextareaWithButton() {
  const { sendMessage, generatingResponse } = useInterviewStore();

  return (
    <div className="flex m-8 items-end">
      <form onSubmit={sendMessage} className="flex">
        <Textarea
          placeholder="Type your message here."
          className="mb-4 shadow-sm focus-visible:ring-0 focus-visible:border-none  "
          rows="40"
        />
        <Button type="submit" disabled={generatingResponse}>
          <SendIcon />
        </Button>
      </form>
    </div>
  );
}
