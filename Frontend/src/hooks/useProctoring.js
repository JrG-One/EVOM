import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner"; // Assuming sonner is used, or I'll use simple window.alert or a callback

export const useProctoring = (isActive = true) => {
    const [warnings, setWarnings] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    const handleViolation = useCallback((message) => {
        setWarnings(prev => prev + 1);
        console.warn(`Proctoring Warning: ${message}`);
        toast.warning("Proctoring Alert", { description: message });
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => prev + 1);
                handleViolation("You switched tabs! This action is recorded.");
            }
        };

        const handleBlur = () => {
            // Often redundant with visibilityChange but catches window focus loss too
            // handleViolation("Window lost focus."); 
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                handleViolation("Exited fullscreen mode so early! Please maintain fullscreen.");
            } else {
                setIsFullscreen(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        // window.addEventListener("blur", handleBlur); // Can be too aggressive
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            // window.removeEventListener("blur", handleBlur);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [isActive, handleViolation]);

    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } catch (err) {
            console.error("Error attempting to enable fullscreen:", err);
        }
    };

    return {
        warnings,
        isFullscreen,
        tabSwitchCount,
        enterFullscreen
    };
};
