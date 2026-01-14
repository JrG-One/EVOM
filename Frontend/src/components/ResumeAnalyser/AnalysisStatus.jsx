// src/components/ResumeAnalyzer/AnalysisStatus.jsx
import React from 'react';
import { useState } from 'react';
import { FileText, CheckCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CircularLoader from './loader';

const AnalysisStatus = ({ file, analysisComplete, handleReupload }) => {
  const [loaderDone, setLoaderDone] = useState(false);
  const showResult = analysisComplete && loaderDone;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2" />
          {file?.name}
        </CardTitle>
        <CardDescription>
          {!analysisComplete ? 'Analyzing your resume...' : 'Analysis complete'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResult ? (
          <div className="space-y-4">
            <CircularLoader
              analysisCompleted={analysisComplete}
              onComplete={() => setLoaderDone(true)}
            />
          </div>
        ) : (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              Your resume has been analyzed successfully. View the detailed feedback below.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={handleReupload} className="flex items-center">
          <RotateCcw className="mr-2 h-4 w-4" />
          Upload Another Resume
        </Button>
        {/* <Button disabled={isAnalyzing}>Download Full Report</Button> */}
      </CardFooter>
    </Card>
  );
};

export default AnalysisStatus;