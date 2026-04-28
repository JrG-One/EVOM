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
    "end interview",
    "finish interview",
    "stop interview",
  ];
  return endPhrases.some((phrase) => lower.includes(phrase));
};

const parseAIResponse = (rawReply) => {
  const nextQuestionReady = rawReply.includes("<<NEXT_QUESTION>>");
  
  // We determine explicit end states for internal logic, 
  // but we will force interviewShouldEnd to true globally so the user can always exit.
  const explicitEnd = rawReply.includes("<<END_INTERVIEW>>");
  const implicitEnd = detectEndIntent(rawReply);

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

  // Force interviewShouldEnd to true so the button is never locked
  return { cleanedReply, questionType, interviewShouldEnd: true, nextQuestionReady, isNaturalEnd: explicitEnd || implicitEnd };
};

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: "",
        company: "",
        role: "",
        experience: "",
        preferredLanguage: "",
        codingRound: false,
      },
      interviewId: null,
      nextQuestionReady: false,
      analysisReport: null,
      interviewShouldEnd: true, // Default to true so it's always available
      generatingResponse: false,
      currentQuestionType: "THEORY",
      isLoading: false,
      conversation: [],
      currentCoversationIndex: 0,
      interviews: [],
      isVoiceMode: false, // Default to false (Student Mic)
      isListening: false,
      isSpeaking: false,

      setVoiceMode: (enabled) => {
        set({ isVoiceMode: enabled });
        if (!enabled) {
          set({ isListening: false });
        } else {
          // Warm up audiocontext/speech
          const utterance = new SpeechSynthesisUtterance("");
          window.speechSynthesis.speak(utterance);
        }
      },

      setListening: (listening) => {
        if (!get().isVoiceMode && listening) return;
        set({ isListening: listening });
      },

      speakAIResponse: (text) => {
        // AI bot ALWAYS speaks, regardless of isVoiceMode (student mic) toggle
        try {
          window.speechSynthesis.cancel();
          window.speechSynthesis.resume();

          const cleanText = text.replace(/<<.*?>>/g, '').replace(/[#*`]/g, '').trim();
          if (!cleanText) return;

          const utterance = new SpeechSynthesisUtterance(cleanText);

          const executeSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google")))
              || voices.find(v => v.lang.startsWith('en'))
              || voices[0];

            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.rate = 1.1;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => set({ isSpeaking: true });
            utterance.onend = () => set({ isSpeaking: false });
            utterance.onerror = () => set({ isSpeaking: false });

            window.speechSynthesis.speak(utterance);
          };

          if (window.speechSynthesis.getVoices().length > 0) {
            executeSpeak();
          } else {
            window.speechSynthesis.onvoiceschanged = executeSpeak;
          }
        } catch (e) {
          console.error("Speech synthesis failed", e);
          set({ isSpeaking: false });
        }
      },

      setFormData: async (data) => {
        set({ isLoading: true });
        const { startInterview } = get();
        try {
          const response = await axiosInstance.post("/interview/", data);
          set((state) => ({
            formData: { ...state.formData, ...data },
            interviewId: response.data.interviewId,
          }));
          toast.success("Ready for session!");
          startInterview();
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          toast.error("Failed to set interview data.");
        }
      },

      startInterview: async () => {
        set({ isLoading: true, nextQuestionReady: false, conversation: [], isVoiceMode: true, interviewShouldEnd: true });
        const { formData, interviewId } = get();
        const { role: jobRole, company: targetCompany, codingRound } = formData;

        const systemMessage = {
          role: "system",
          content: `You're an elite technical interviewer for ${jobRole} at ${targetCompany}. Ask questions concisely. Tag responses with <<TYPE:THEORY>> or <<TYPE:CODING>>.`
        };
        const userMessage = {
          role: "user",
          content: codingRound ? `Start coding round.` : `Start conceptual round.`
        };

        try {
          const response = await axiosInstance.post("/chat", { 
            interviewId: interviewId, 
            message: `Introduce yourself as the elite interviewer with name "EVOM AI" and start the technical interview for ${jobRole} at ${targetCompany}. Welcome the candidate to the EVOM platform.` 
          });
          const { cleanedReply, questionType, nextQuestionReady } = parseAIResponse(response.data.reply);

          set({
            conversation: [systemMessage, userMessage, { role: "assistant", content: cleanedReply }],
            currentCoversationIndex: 2,
            isLoading: false,
            currentQuestionType: questionType || "THEORY",
            nextQuestionReady
          });

          get().speakAIResponse(cleanedReply);
        } catch (e) {
          set({ isLoading: false });
          toast.error("Failed to start the interview.");
        }
      },

      sendMessage: async (content) => {
        if (!content || content.trim() === "") return;
        set({ generatingResponse: true });

        const userMsg = content.trim();
        const { conversation, interviewId } = get();

        const updatedConversation = [
          ...conversation,
          { role: "user", content: userMsg }
        ];

        set({ conversation: updatedConversation });

        try {
          const response = await axiosInstance.post("/chat", { 
            interviewId: interviewId, 
            message: userMsg 
          });
          const { cleanedReply, questionType, nextQuestionReady } = parseAIResponse(response.data.reply);

          set((state) => ({
            conversation: [...state.conversation, { role: "assistant", content: cleanedReply }],
            nextQuestionReady,
            // Keep interviewShouldEnd true
            interviewShouldEnd: true, 
            currentQuestionType: questionType || "THEORY",
          }));

          get().speakAIResponse(cleanedReply);
        } catch (error) {
          set({ generatingResponse: false });
        } finally {
          set({ generatingResponse: false });
        }
      },

      generateNewQuestion: async () => {
        set({ isLoading: true, nextQuestionReady: false });
        const { conversation, interviewId } = get();
        const userMessage = { role: "user", content: "Proceed to the next question." };

        try {
          const response = await axiosInstance.post("/chat", { 
            interviewId: interviewId, 
            message: "Proceed to the next question." 
          });
          const { cleanedReply, questionType } = parseAIResponse(response.data.reply);

          set((state) => ({
            conversation: [...state.conversation, userMessage, { role: "assistant", content: cleanedReply }],
            isLoading: false,
            currentQuestionType: questionType || "THEORY",
            nextQuestionReady: false
          }));

          get().speakAIResponse(cleanedReply);
        } catch (e) {
          set({ isLoading: false });
        }
      },

      endInterview: async () => {
        const { interviewId, sendMessage } = get();
        try {
          toast.info("Ending interview and generating report...");
          // 1. Get a polite closing statement from the AI
          await sendMessage("The candidate has requested to end the interview. Provide a polite closing statement like 'Thank you for your time. Please check your detailed report on your profile and feel free to practice more!' and tag it with <<END_INTERVIEW>>.");
          
          // 2. Trigger analysis after a brief delay to allow AI to speak
          setTimeout(async () => {
            try {
                const response = await axiosInstance.post("/portal/analysis", { interviewId });
                if (response.data.pdfUrl) window.open(response.data.pdfUrl, "_blank");
                set({ analysisReport: response.data });
            } catch (analysisError) {
                console.error("Failed to generate analysis:", analysisError);
                toast.error("Interview ended, but failed to generate the final report.");
            }
          }, 4000);
        } catch (error) {
          console.error("Error ending interview:", error);
          toast.error("Failed to end the interview cleanly.");
        }
      },

      fetchUserInterviews: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get("/interview");
          set({ interviews: res.data });
        } catch (error) {
            console.error("Failed to fetch interviews", error);
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