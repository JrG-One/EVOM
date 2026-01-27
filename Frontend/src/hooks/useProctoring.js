import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner"; // Assuming sonner is used, or I'll use simple window.alert or a callback

export const useProctoring = (isActive = true) => {
    const [warnings, setWarnings] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);

    const handleViolation = useCallback((message) => {
        setWarnings(prev => prev + 1);
        console.warn(`Proctoring Warning: ${message}`);
        toast.warning("Proctoring Alert", {
            description: message,
            action: {
                label: "Dismiss",
                onClick: () => console.log("Warning dismissed")
            },
            closeButton: true,
            duration: 10000 // Keep it long enough to read but let them close it
        });
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

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ''; // Chrome requires returnValue to be set
            handleViolation("Attempted to reload/leave. This action is recorded.");
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
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

    const exitFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.error("Error attempting to exit fullscreen:", err);
        }
    };

    return {
        warnings,
        isFullscreen,
        tabSwitchCount,
        enterFullscreen,
        exitFullscreen
    };
};
