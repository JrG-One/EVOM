// src/components/ResumeAnalyzer/ResultTabs/KeywordsTab.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const KeywordsTab = ({ keywords }) => {
  return (
    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <CardHeader className="border-b border-white/5 pb-6">
        <CardTitle className="flex items-center text-xl font-bold text-white">
          <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
          Resume Optimization Tips
        </CardTitle>
        <CardDescription className="text-gray-400">
          Actionable advice and keywords to improve your ATS ranking.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 px-4 py-2 text-sm leading-relaxed rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 cursor-default whitespace-normal h-auto text-left"
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