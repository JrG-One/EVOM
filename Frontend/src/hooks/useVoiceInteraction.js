import { useEffect, useRef, useCallback, useState } from 'react';
import { useInterviewStore } from '../store/useInterviewStore';

const useVoiceInteraction = () => {
    const {
        isVoiceMode,
        isSpeaking,
        setListening,
        generatingResponse
    } = useInterviewStore();

    const recognitionRef = useRef(null);
    const transcriptRef = useRef("");
    const isVoiceModeRef = useRef(isVoiceMode); // Track current voice mode state
    const [currentTranscript, setCurrentTranscript] = useState("");

    const startRecognition = useCallback(() => {
        if (!recognitionRef.current || !isVoiceMode || isSpeaking || generatingResponse) return;

        try {
            // Clear previous transcript to avoid duplication
            transcriptRef.current = "";
            setCurrentTranscript("");

            recognitionRef.current.start();
            setListening(true);
        } catch (error) {
            console.warn("Speech recognition already started or failed:", error);
        }
    }, [isVoiceMode, isSpeaking, generatingResponse, setListening]);

    const stopRecognition = useCallback((shouldClear = true) => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
        }
        setListening(false);

        // Clear transcript if requested (when turning off mic)
        if (shouldClear) {
            transcriptRef.current = "";
            setCurrentTranscript("");
        }
    }, [setListening]);

    const clearTranscript = useCallback(() => {
        transcriptRef.current = "";
        setCurrentTranscript("");
    }, []);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Web Speech API is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = "";
            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Update the ref with final transcript
            if (finalTranscript) {
                transcriptRef.current += finalTranscript + " ";
            }

            // Update state for real-time display (final + interim)
            setCurrentTranscript(transcriptRef.current + interimTranscript);
        };

        recognition.onend = () => {
            setListening(false);
            // Auto-restart ONLY if voice mode is currently enabled (check ref for current value)
            if (isVoiceModeRef.current && !isSpeaking && !generatingResponse) {
                setTimeout(startRecognition, 100);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isVoiceMode, isSpeaking, generatingResponse, setListening, startRecognition]);

    // Update ref whenever isVoiceMode changes
    useEffect(() => {
        isVoiceModeRef.current = isVoiceMode;
    }, [isVoiceMode]);

    useEffect(() => {
        if (isVoiceMode && !isSpeaking && !generatingResponse) {
            startRecognition();
        } else {
            // When turning off voice mode, clear the transcript
            stopRecognition();
        }
    }, [isVoiceMode, isSpeaking, generatingResponse, startRecognition, stopRecognition]);

    return {
        transcript: currentTranscript,
        clearTranscript
    };
};

export default useVoiceInteraction;
