
// src/components/ResumeAnalyzer/ResultTabs/OverviewTab.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OverviewTab = ({ score }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resume Score</CardTitle>
          <CardDescription>Overall evaluation of your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold">{score}%</div>
              </div>
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                  strokeDasharray={`${score}, 100`}
                />
              </svg>
            </div>
          </div>
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">Resume Length</p>
              <p>2 pages (Appropriate)</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">ATS Compatibility</p>
              <p>85% (Good)</p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;