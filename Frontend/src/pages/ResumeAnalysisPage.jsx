import React, { useState } from 'react';
import UploadZone from '../components/ResumeAnalyser/UploadZone';
import AnalysisStatus from '../components/ResumeAnalyser/AnalysisStatus';
import ResultTabs from '../components/ResumeAnalyser/ResultTabs';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { SearchCode } from 'lucide-react';

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { updateScore } = useAuthStore();

  const [analysisResults, setAnalysisResults] = useState({
    score: 0,
    strengths: [],
    improvements: [],
    keywords: [],
    sections: {},
  });

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setIsUploaded(true);
        await analyzeResume(selectedFile);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  // ✅ Utility: Parse feedback text into strengths & improvements
  const parseFeedbackSections = (text) => {
    const strengths = [];
    const improvements = [];
    const summary = [];
    let currentSection = null;

    if (!text) return { strengths, improvements, summary: "" };

    const lines = text.split("\n");
    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const lowerLine = trimmed.toLowerCase();

      // Header detection
      if (lowerLine.startsWith('strength')) {
        currentSection = 'strengths';
        continue;
      }
      if (lowerLine.startsWith('area') || lowerLine.startsWith('improvement') || lowerLine.startsWith('weakness')) {
        currentSection = 'improvements';
        continue;
      }
      if (lowerLine.startsWith('summary') || lowerLine.startsWith('overall')) {
        currentSection = 'summary';
        continue;
      }

      // Match bullets or numbered lists (1. or - or *)
      const match = trimmed.match(/^(\d+[\.\)]|\u2022|-|\*)\s+(.*)/);

      if (match && currentSection) {
        const item = match[2].trim();
        if (currentSection === 'strengths') strengths.push(item);
        else if (currentSection === 'improvements') improvements.push(item);
        else if (currentSection === 'summary') summary.push(item);
      } else if (currentSection && (strengths.length > 0 || improvements.length > 0 || summary.length > 0)) {
        // Append to last item if it's a continuation line
        const targetArr = currentSection === 'strengths' ? strengths
          : currentSection === 'improvements' ? improvements
            : summary;

        if (targetArr.length > 0) {
          targetArr[targetArr.length - 1] += " " + trimmed;
        }
      }
    }

    return {
      strengths,
      improvements,
      summary: summary.join(" ")
    };
  };

  const analyzeResume = async (file) => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Upload resume
      const uploadRes = await axiosInstance.put('/resume/upload-resume', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { resumeUrl, resumeText } = uploadRes.data;

      console.log("Extracted Text Length:", resumeText?.length || 0);

      // Parallel analysis requests (Removed tips)
      const [atsRes, feedbackRes] = await Promise.all([
        axiosInstance.post('/resume/ats-score', { resumeUrl, resumeText }, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.post('/resume/resume-feedback', { resumeUrl, resumeText }, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      // Score
      const score = parseInt(atsRes.data.atsScore, 10);
      updateScore({ atsScore: score });

      console.log("Raw Feedback:", feedbackRes.data.feedback);

      // Feedback sections
      const { strengths, improvements, summary } = parseFeedbackSections(feedbackRes.data.feedback);
      console.log("Parsed Strengths:", strengths);
      console.log("Parsed Improvements:", improvements);
      console.log("Parsed Summary:", summary);

      // Final state update
      setAnalysisResults({
        score,
        strengths,
        improvements,
        summary,
        keywords: [], // Empty as feature is removed
        sections: {},
      });

      setAnalysisComplete(true);
    } catch (err) {
      console.error("❌ Error analyzing resume:", err);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReupload = () => {
    setFile(null);
    setIsUploaded(false);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setAnalysisResults({
      score: 0,
      strengths: [],
      improvements: [],
      keywords: [],
      sections: {},
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 lg:p-10 font-sans selection:bg-purple-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 ring-1 ring-white/10 shadow-2xl mb-4 backdrop-blur-md">
            <SearchCode className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Optimization</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Upload your resume to get an AI-powered analysis against elite industry standards.
            Receive actionable feedback and keyword optimization tips.
          </p>
        </div>

        {!isUploaded ? (
          <UploadZone
            isDragging={isDragging}
            handleDragEnter={handleDragEnter}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
          />
        ) : (
          <div className="space-y-6">
            <AnalysisStatus
              file={file}
              isAnalyzing={isAnalyzing}
              analysisComplete={analysisComplete}
              handleReupload={handleReupload}
            />

            {isAnalyzing && (
              <div className="text-center text-blue-400 font-medium animate-pulse">Running full spectrum analysis...</div>
            )}

            {!isAnalyzing && analysisComplete && (
              <ResultTabs analysisResults={analysisResults} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}