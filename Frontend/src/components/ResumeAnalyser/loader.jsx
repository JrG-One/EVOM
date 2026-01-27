// src/components/ResumeAnalyzer/loader.jsx
import React, { useState, useEffect } from 'react';

const CircularLoader = ({ analysisCompleted, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing resume analysis...');

  const statusMessages = [
    'Initializing resume analysis...',
    'Extracting information from your resume...',
    'Evaluating content and structure...',
    'Identifying key skills and experiences...',
    'Comparing with industry standards...',
    'Generating ATS compatibility score...',
    'Preparing detailed feedback...',
    'Almost there, finalizing analysis...',
    'Analysis complete!' // Final message
  ];

  const size = 120;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (analysisCompleted) {
      setProgress(100);
      setStatusText(statusMessages[statusMessages.length - 1]);
      return;
    }

    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(oldProgress => {
          const newProgress = Math.min(oldProgress + 5, 100);
          const messageIndex = Math.floor((newProgress / 100) * (statusMessages.length - 1));
          setStatusText(statusMessages[messageIndex]);
          return newProgress;
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [progress, analysisCompleted]);

  useEffect(() => {
    if (progress === 100 && analysisCompleted) {
      onComplete?.(); // Fire callback once progress hits 100 and analysis is done
    }
  }, [progress, analysisCompleted, onComplete]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle with Gradient */}
          <defs>
            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" /> {/* Purple */}
              <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
            </linearGradient>
          </defs>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="url(#loaderGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black text-white">{progress}%</span>
        </div>
      </div>

      <p className="text-sm text-gray-400 animate-pulse text-center max-w-xs font-medium tracking-wide">
        {statusText}
      </p>
    </div>
  );
};

export default CircularLoader;