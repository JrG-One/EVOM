// src/components/ResumeAnalyzer/ResultTabs/index.jsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import FeedbackTab from './FeedbackTab';
import KeywordsTab from './KeywordsTab';

const ResultTabs = ({ analysisResults }) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="keywords">Tips</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab score={analysisResults.score} />
      </TabsContent>
      
      <TabsContent value="feedback">
        <FeedbackTab 
            strengths={analysisResults.strengths}
            improvements={analysisResults.improvements}       
         />
      </TabsContent>
      
      <TabsContent value="keywords">
        <KeywordsTab keywords={analysisResults.keywords} />
      </TabsContent>
    </Tabs>
  );
};

export default ResultTabs;
