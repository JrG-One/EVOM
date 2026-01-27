
// src/components/ResumeAnalyzer/ResultTabs/OverviewTab.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OverviewTab = ({ score }) => {
  const getColor = (s) => {
    if (s >= 80) return "#22c55e"; // green-500
    if (s >= 60) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const strokeColor = getColor(score);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-[2rem]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-black tracking-tight text-white mb-2">Resume Score</CardTitle>
          <CardDescription className="text-gray-400">ATS Compatibility & Content Evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-full blur-[40px] opacity-20 transition-all duration-1000"
                style={{ backgroundColor: strokeColor }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="text-6xl font-black tracking-tighter text-white drop-shadow-lg">
                  {score}
                  <span className="text-2xl text-gray-500 ml-1">%</span>
                </div>
                <div
                  className="text-sm font-bold uppercase tracking-widest mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                  style={{ color: strokeColor }}
                >
                  {score >= 80 ? 'Excellent' : score >= 60 ? 'Average' : 'Needs Work'}
                </div>
              </div>

              <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Additional stats could go here later */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;