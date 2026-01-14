// src/components/ResumeAnalyzer/ResultTabs/KeywordsTab.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const KeywordsTab = ({ keywords }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvement Tips</CardTitle>
        <CardDescription>Here are some improvement tips by improving them you can modify and better your resume.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge
            key={index}
            variant="secondary"
            className="text-sm py-1.5 break-words whitespace-normal w-full sm:w-auto max-w-full"
          >
            {keyword}
          </Badge>
          
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordsTab;