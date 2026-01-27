import { useEffect, useRef, useCallback } from 'react';
import { useInterviewStore } from '../store/useInterviewStore';

const useVoiceInteraction = () => {
    const {
        isVoiceMode,
        isSpeaking,
        setListening,
        sendMessage,
        generatingResponse
    } = useInterviewStore();

    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const transcriptRef = useRef("");

    const startRecognition = useCallback(() => {
        if (!recognitionRef.current || !isVoiceMode || isSpeaking || generatingResponse) return;

        try {
            recognitionRef.current.start();
            setListening(true);
        } catch (error) {
            console.warn("Speech recognition already started or failed:", error);
        }
    }, [isVoiceMode, isSpeaking, generatingResponse, setListening]);

    const stopRecognition = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
        }
        setListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        // If we have text when stopping, submit it
        if (transcriptRef.current.trim()) {
            sendMessage(transcriptRef.current);
            transcriptRef.current = "";
        }
    }, [setListening, sendMessage]);

    const handleSilence = useCallback(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        silenceTimerRef.current = setTimeout(() => {
            if (transcriptRef.current.trim()) {
                console.log("Silence detected, submitting transcript:", transcriptRef.current);
                sendMessage(transcriptRef.current);
                transcriptRef.current = "";
                stopRecognition();
            }
        }, 2000); // 2 seconds silence detection
    }, [sendMessage, stopRecognition]);

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
            let currentFullTranscript = "";
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    transcriptRef.current += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            // If we have any transcript or interim text, reset silence timer
            if (transcriptRef.current.trim() || interim.trim()) {
                handleSilence();
            }
        };

        recognition.onend = () => {
            setListening(false);
            // Auto-restart if in voice mode and not speaking/generating
            if (isVoiceMode && !isSpeaking && !generatingResponse) {
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
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [isVoiceMode, isSpeaking, generatingResponse, handleSilence, setListening, startRecognition]);

    useEffect(() => {
        if (isVoiceMode && !isSpeaking && !generatingResponse) {
            startRecognition();
        } else {
            stopRecognition();
        }
    }, [isVoiceMode, isSpeaking, generatingResponse, startRecognition, stopRecognition]);

    return { transcript: transcriptRef.current };
};

export default useVoiceInteraction;
