// src/components/ResumeAnalyzer/UploadZone.jsx
import React from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UploadZone = ({ isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileChange }) => {
  return (
    <Card className={`border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed'}`}>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div 
          className="w-full h-64 flex flex-col items-center justify-center cursor-pointer"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Drop your resume here or click to browse</p>
          <p className="text-sm text-gray-500 mb-4">Upload a PDF file (max 5MB)</p>
          <Button variant="outline">Select PDF</Button>
          <input 
            id="file-input" 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadZone;