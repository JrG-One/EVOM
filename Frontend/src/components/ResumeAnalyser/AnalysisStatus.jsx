// src/components/ResumeAnalyzer/AnalysisStatus.jsx
import React from 'react';
import { useState } from 'react';
import { FileText, CheckCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CircularLoader from './loader';

const AnalysisStatus = ({ file, analysisComplete, handleReupload }) => {
  const [loaderDone, setLoaderDone] = useState(false);
  const showResult = analysisComplete && loaderDone;
  return (
    <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-white flex items-center mb-2">
              <FileText className="mr-3 text-blue-400" />
              {file?.name}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {!analysisComplete ? 'Processing document...' : 'Analysis successfully completed'}
            </CardDescription>
          </div>
          {showResult && (
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
              Ready
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {!showResult ? (
          <div className="flex justify-center py-8">
            <CircularLoader
              analysisCompleted={analysisComplete}
              onComplete={() => setLoaderDone(true)}
            />
          </div>
        ) : (
          <Alert variant="default" className="bg-green-500/5 border-green-500/20 rounded-2xl">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <AlertTitle className="text-green-400 font-bold ml-2">Analysis Complete</AlertTitle>
            <AlertDescription className="text-green-400/80 ml-2 mt-1">
              Your resume has been analyzed successfully. Use the tabs below to explore the detailed insights.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="bg-white/[0.02] border-t border-white/5 p-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleReupload}
          className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Analyze Another
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnalysisStatus;