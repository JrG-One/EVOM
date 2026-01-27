import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WebcamPreview = ({ className }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    useEffect(() => {
        let mounted = true;

        const startMedia = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                if (mounted) setError("Media API not supported. Check https/localhost.");
                return;
            }

            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (mounted) {
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error("Error accessing media devices:", err);
                    setError(`${err.name}: ${err.message}`);
                }
            }
        };

        startMedia();

        return () => {
            mounted = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicOn(audioTrack.enabled);
            }
        }
    };

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOn(videoTrack.enabled);
            }
        }
    };

    return (
        <Card className={`relative overflow-hidden bg-[#0a0a0a] rounded-none border-none shadow-none w-full h-full flex flex-col justify-center items-center ${className}`}>
            {error ? (
                <div className="text-destructive flex flex-col items-center p-4 text-center">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover mirror ${!isCameraOn ? 'hidden' : ''}`}
                        style={{ transform: 'scaleX(-1)' }} // Mirror the view for a more natural feel
                    />
                    {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                            <VideoOff className="w-12 h-12 text-zinc-600/50" />
                        </div>
                    )}

                    {/* Subtle Controls Overlay */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 rounded-xl ${!isMicOn ? 'text-red-500 hover:text-red-400 hover:bg-red-500/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                            onClick={toggleMic}
                        >
                            {isMicOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 rounded-xl ${!isCameraOn ? 'text-red-500 hover:text-red-400 hover:bg-red-500/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                            onClick={toggleCamera}
                        >
                            {isCameraOn ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                        </Button>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-white/40 leading-none">Live</span>
                    </div>
                </>
            )}
        </Card>
    );
};

export default WebcamPreview;
