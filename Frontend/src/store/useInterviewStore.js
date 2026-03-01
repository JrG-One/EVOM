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
        preferredLanguage: "",
        codingRound: false,
      },
      interviewId: null,
      nextQuestionReady: false,
      analysisReport: null,
      interviewShouldEnd: false,
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
            utterance.rate = 1.0;
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
        }
      },

      startInterview: async () => {
        set({ isLoading: true, nextQuestionReady: false, conversation: [], isVoiceMode: true });
        const { formData } = get();
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
          const response = await axiosInstance.post("/chat", { messages: [systemMessage, userMessage] });
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
        }
      },

      sendMessage: async (content) => {
        if (!content || content.trim() === "") return;
        set({ generatingResponse: true });

        const userMsg = content.trim();
        const { conversation } = get();
        const { role: jobRole, company: targetCompany } = get().formData;

        const systemMessage = {
          role: "system",
          content: `Experienced interviewer for ${jobRole} at ${targetCompany}. Use <<TYPE:THEORY>> or <<TYPE:CODING>>.`
        };

        const updatedConversation = [
          ...conversation.filter(msg => msg.role !== 'system'),
          systemMessage,
          { role: "user", content: userMsg }
        ];

        set({ conversation: updatedConversation });

        try {
          const response = await axiosInstance.post("/chat", { messages: updatedConversation });
          const { cleanedReply, questionType, interviewShouldEnd, nextQuestionReady } = parseAIResponse(response.data.reply);

          set((state) => ({
            conversation: [...state.conversation, { role: "assistant", content: cleanedReply }],
            nextQuestionReady,
            interviewShouldEnd: interviewShouldEnd || state.interviewShouldEnd,
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
        const { conversation } = get();
        const userMessage = { role: "user", content: "Proceed to the next question." };

        try {
          const response = await axiosInstance.post("/chat", { messages: [...conversation, userMessage] });
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
        const { conversation, interviewId, formData } = get();
        const feedback = conversation.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
        try {
          const response = await axiosInstance.post("/portal/analysis", { interviewId, feedback, formData });
          if (response.data.pdfUrl) window.open(response.data.pdfUrl, "_blank");
          set({ analysisReport: response.data });
        } catch (error) { }
      },

      fetchUserInterviews: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get("/interview");
          set({ interviews: res.data });
        } catch (error) {
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
