// src/components/ResumeAnalyzer/ResultTabs/index.jsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import FeedbackTab from './FeedbackTab';
import KeywordsTab from './KeywordsTab';

const ResultTabs = ({ analysisResults }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-2 mb-8 bg-white/5 border border-white/10 p-1 rounded-xl">
        <TabsTrigger
          value="overview"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-900/50 rounded-lg transition-all duration-300 font-medium"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="feedback"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-900/50 rounded-lg transition-all duration-300 font-medium"
        >
          Feedback
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab score={analysisResults.score} />
      </TabsContent>

      <TabsContent value="feedback">
        <FeedbackTab
          strengths={analysisResults.strengths}
          improvements={analysisResults.improvements}
          summary={analysisResults.summary}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ResultTabs;
