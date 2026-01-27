// src/components/ResumeAnalyzer/ResultTabs/FeedbackTab.jsx
import React from 'react';
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeedbackTab = ({ strengths, improvements, summary }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      {/* Summary Card */}
      {summary && (
        <Card className="bg-purple-500/5 border-purple-500/20 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-purple-500/10 pb-4">
            <CardTitle className="text-purple-400 flex items-center text-xl font-bold">
              <Lightbulb className="mr-3 h-6 w-6" />
              Review Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-purple-100/90 text-sm font-medium leading-relaxed italic">
              "{summary}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Strengths Card */}
      <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="border-b border-emerald-500/10 pb-4">
          <CardTitle className="text-emerald-400 flex items-center text-xl font-bold">
            <CheckCircle className="mr-3 h-6 w-6" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="grid gap-4">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start text-emerald-100/80 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 mr-3 flex-shrink-0 shadow-[0_0_8px_#10b981]" />
                <span className="text-sm font-medium leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Improvements Card */}
      <Card className="bg-amber-500/5 border-amber-500/20 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="border-b border-amber-500/10 pb-4">
          <CardTitle className="text-amber-400 flex items-center text-xl font-bold">
            <AlertTriangle className="mr-3 h-6 w-6" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="grid gap-4">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start text-amber-100/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 mr-3 flex-shrink-0 shadow-[0_0_8px_#f59e0b]" />
                <span className="text-sm font-medium leading-relaxed">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackTab;