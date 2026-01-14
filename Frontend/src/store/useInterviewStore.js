import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

const detectEndIntent = (message) => {
  const lower = message.toLowerCase();
  const endPhrases = [
    "thank you for participating",
    "that concludes our mock interview",
    "good luck",
    "if you have any feedback",
    "feel free to reach out",
    "wish you all the best",
    "great talking with you",
    "all the best",
    "end of the interview",
    "Thank you for sharing your insights and experiences with me today.",
    "wrap up",
  ];
  return endPhrases.some((phrase) => lower.includes(phrase));
};

const parseAIResponse = (rawReply) => {
  const nextQuestionReady = rawReply.includes("<<NEXT_QUESTION>>");
  const explicitEnd = rawReply.includes("<<END_INTERVIEW>>");
  const implicitEnd = detectEndIntent(rawReply);
  const interviewShouldEnd = explicitEnd || implicitEnd;

  let questionType = null;
  if (rawReply.includes("<<TYPE:CODING>>")) {
    questionType = "CODING";
  } else if (rawReply.includes("<<TYPE:THEORY>>")) {
    questionType = "THEORY";
  }

  const cleanedReply = rawReply
    .replace(/<<NEXT_QUESTION>>/g, "")
    .replace(/<<END_INTERVIEW>>/g, "")
    .replace(/<<TYPE:CODING>>/g, "")
    .replace(/<<TYPE:THEORY>>/g, "")
    .trim();

  return { cleanedReply, questionType, interviewShouldEnd, nextQuestionReady };
};

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: "",
        company: "",
        role: "",
        experience: "",
        prefferedLanguage: "",
        codingRound: false,
      },
      interviewId: null,
      nextQuestionReady: false,
      analysisReport: null,
      interviewShouldEnd: false,
      generatingResponse: false,
      // New State for P2
      currentQuestionType: "THEORY",
      isLoading: false,
      conversation: [],
      currentCoversationIndex: 0,
      interviews: [],

      setFormData: async (data) => {
        set({ isLoading: true });

        const { startInterview } = get();

        try {
          console.log("Sending data:", data);
          const response = await axiosInstance.post("/interview/", data);
          console.log("Response received:", response.data);

          set((state) => {
            const updatedFormData = { ...state.formData, ...data };
            console.log("Updated formData state:", updatedFormData);
            return {
              formData: updatedFormData,
              interviewId: response.data.interviewId,
            };
          });

          toast.success("Form submitted successfully!");
          startInterview();
          set({ isLoading: false });
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("Failed to submit form. Please try again.");
        }
      },

      startInterview: async () => {
        set({ isLoading: true, nextQuestionReady: false, conversation: [] });

        const { formData } = get();

        const {
          role: jobRole,
          company: targetCompany,
          prefferedLanguage: preferredLanguage,
          experience: yearsOfExperience,
          codingRound,
        } = formData;

        const systemMessage = {
          role: "system",
          content: `
You are a senior technical interviewer conducting mock interviews for the role of ${jobRole} at ${targetCompany}.
Start your interview with a warm greeting. Ask one question at a time, wait for answers.
IMPORTANT: Prefix every question with a tag indicating the type of question.
- If it is a Coding/Programming question requiring code, start with <<TYPE:CODING>>.
- If it is a Theory/Behavioral/Conceptual question, start with <<TYPE:THEORY>>.
- Example: "<<TYPE:THEORY>> Tell me about yourself." or "<<TYPE:CODING>> Write a function to reverse a string."
Use <<NEXT_QUESTION>> to indicate readiness for the next.
Use <<END_INTERVIEW>> to end the interview.
      `.trim(),
        };

        const userMessage = {
          role: "user",
          content: codingRound
            ? `Generate a technical question for a ${jobRole} role at ${targetCompany}, using ${preferredLanguage}, experience: ${yearsOfExperience} years.`
            : `Generate a theoretical/behavioral question for a ${jobRole} role at ${targetCompany}, with ${yearsOfExperience} years of experience.`,
        };

        const initialMessages = [systemMessage, userMessage];
        const response = await axiosInstance.post("/chat", {
          messages: initialMessages,
        });

        const rawReply = response.data.reply;
        const { cleanedReply, questionType, interviewShouldEnd, nextQuestionReady } = parseAIResponse(rawReply);

        const updatedConversation = [
          ...initialMessages,
          { role: "assistant", content: cleanedReply },
        ];

        set({
          conversation: updatedConversation,
          currentCoversationIndex: 2,
          isLoading: false,
          currentQuestionType: questionType || "THEORY",
          interviewShouldEnd,
          nextQuestionReady
        });
      },

      sendMessage: async (event) => {
        // event.preventDefault();
        if (!event || event.trim() === "") return;
        set({ generatingResponse: true });

        const userMessage = event.trim();
        const { conversation } = get();

        const hasSystemMessage = conversation.some(
          (msg) => msg.role === "system" || msg.role === "developer",
        );

        const systemMessage = {
          role: "system",
          content:
            "You're an experienced technical interviewer. Ask thoughtful, contextual questions based on the chat history.",
        };

        const updatedConversation = [
          ...(hasSystemMessage ? [] : [systemMessage]),
          ...conversation,
          { role: "user", content: userMessage },
        ];

        console.log("📤 [Frontend] Sending to /chat API:");
        console.log(JSON.stringify({ messages: updatedConversation }, null, 2));

        set({ conversation: updatedConversation });

        try {
          const response = await axiosInstance.post("/chat", {
            messages: updatedConversation,
          });

          const rawReply = response.data.reply;
          const { cleanedReply, questionType, interviewShouldEnd, nextQuestionReady } = parseAIResponse(rawReply);

          if (interviewShouldEnd) {
            const { endInterview } = get();
            endInterview();
          }

          const assistantMessage = {
            role: "assistant",
            content: cleanedReply,
          };

          set((state) => ({
            conversation: [...state.conversation, assistantMessage],
            nextQuestionReady,
            interviewShouldEnd,
            currentQuestionType: questionType || state.currentQuestionType, // Preserving existing type if null
          }));
        } catch (error) {
          console.error(
            "❌ [Frontend] Error fetching AI response:",
            error?.response?.data || error.message,
          );
        } finally {
          set({ generatingResponse: false });
        }
      },

      generateNewQuestion: async () => {
        set({
          isLoading: true,
          nextQuestionReady: false,
          interviewShouldEnd: false,
        });

        const { formData, conversation } = get();

        const {
          role: jobRole,
          company: targetCompany,
          prefferedLanguage: preferredLanguage,
          experience: yearsOfExperience,
          codingRound,
        } = formData;

        const userMessage = {
          role: "user",
          content: codingRound
            ? `Ask a new technical question on a different topic for a ${jobRole} role at ${targetCompany}, considering ${yearsOfExperience} years of experience in ${preferredLanguage}.`
            : `Ask a new theoretical/managerial question on a different topic for a ${jobRole} role at ${targetCompany}, with ${yearsOfExperience} years of experience.`,
        };

        const updatedConversation = [...conversation, userMessage];

        const response = await axiosInstance.post("/chat", {
          messages: updatedConversation,
        });

        const rawReply = response.data.reply;
        const { cleanedReply, questionType, interviewShouldEnd, nextQuestionReady } = parseAIResponse(rawReply);

        const assistantMessage = {
          role: "assistant",
          content: cleanedReply,
        };

        set((state) => ({
          currentCoversationIndex: state.conversation.length + 1,
          conversation: [...state.conversation, userMessage, assistantMessage],
          isLoading: false,
          nextQuestionReady: false,
          interviewShouldEnd: false,
          currentQuestionType: questionType,
        }));
      },

      endInterview: async () => {
        const { conversation, interviewId, formData } = get();

        // Convert chat messages into formatted feedback string
        const feedback = conversation
          .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
          .join("\n\n");

        try {
          const response = await axiosInstance.post("/portal/analysis", {
            interviewId,
            feedback,
            formData,
          });

          console.log("✅ Analysis complete:", response.data);
          const { pdfUrl } = response.data;
          if (pdfUrl) {
            window.open(pdfUrl, "_blank");
          }

          // Optionally: Store report URL or trigger UI updates
          set({ analysisReport: response.data });
        } catch (error) {
          console.error(
            "❌ Failed to generate analysis:",
            error?.response?.data || error.message,
          );
        }
      },
      fetchUserInterviews: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get("/interview");
          set({ interviews: res.data });
        } catch (error) {
          console.error("Error fetching interviews:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "interview-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
