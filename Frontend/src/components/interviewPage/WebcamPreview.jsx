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
        <Card className={`relative overflow-hidden bg-black rounded-lg border-2 border-border shadow-lg w-full aspect-video flex flex-col justify-center items-center ${className}`}>
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
                        muted // Muted locally to avoid feedback
                        className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                    />
                    {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                            <VideoOff className="w-12 h-12 text-zinc-600" />
                        </div>
                    )}

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-1.5 rounded-full">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${!isMicOn ? 'text-destructive hover:text-destructive' : 'text-white hover:text-white'}`}
                            onClick={toggleMic}
                        >
                            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${!isCameraOn ? 'text-destructive hover:text-destructive' : 'text-white hover:text-white'}`}
                            onClick={toggleCamera}
                        >
                            {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="absolute top-2 left-2 bg-red-500 rounded-full w-2 h-2 animate-pulse" title="Recording/Live" />
                </>
            )}
        </Card>
    );
};

export default WebcamPreview;
