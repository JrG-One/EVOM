import React, { useState } from 'react';
import UploadZone from '../components/ResumeAnalyser/UploadZone';
import AnalysisStatus from '../components/ResumeAnalyser/AnalysisStatus';
import ResultTabs from '../components/ResumeAnalyser/ResultTabs';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';

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
    let currentSection = null;

    const lines = text.split("\n");
    for (let line of lines) {
      line = line.trim();

      if (/^strengths[:]?$/i.test(line)) {
        currentSection = 'strengths';
        continue;
      }

      if (/areas?\s+for\s+improvement[:]?$/i.test(line)) {
        currentSection = 'improvements';
        continue;
      }

      const match = line.match(/^\d+[\.\)]\s+(.*)/);
      if (match && currentSection) {
        const item = match[1].trim();
        if (currentSection === 'strengths') strengths.push(item);
        if (currentSection === 'improvements') improvements.push(item);
      }
    }

    return { strengths, improvements };
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
      const resumeUrl = uploadRes.data.resumeUrl;

      // Parallel analysis requests
      const [atsRes, feedbackRes, tipsRes] = await Promise.all([
        axiosInstance.post('/resume/ats-score', { resumeUrl }, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.post('/resume/resume-feedback', { resumeUrl }, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axiosInstance.post('/resume/resume-improvement-tips', { resumeUrl }, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Score
      const score = parseInt(atsRes.data.atsScore, 10);
      updateScore({ atsScore: score });

      // Feedback sections
      const { strengths, improvements } = parseFeedbackSections(feedbackRes.data.feedback);

      // Improvement tips → Keywords
      const keywords = [];
      tipsRes.data.improvementTips.split('\n').forEach((line) => {
        const match = line.trim().match(/^\d+[\.\)]\s+(.*)/);
        if (match) keywords.push(match[1].trim());
      });

      // Final state update
      setAnalysisResults({
        score,
        strengths,
        improvements,
        keywords,
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
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">Resume Analyzer</h1>

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
            <div className="text-center text-blue-600 font-medium">Analyzing resume...</div>
          )}

          {!isAnalyzing && analysisComplete && (
            <ResultTabs analysisResults={analysisResults} />
          )}
        </div>
      )}
    </div>
  );
}