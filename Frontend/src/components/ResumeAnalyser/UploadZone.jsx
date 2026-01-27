// src/components/ResumeAnalyzer/UploadZone.jsx
import React from 'react';
import { Upload, FileUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UploadZone = ({ isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileChange }) => {
  return (
    <Card className={`relative overflow-hidden border transition-all duration-300 ${isDragging
        ? 'bg-blue-500/10 border-blue-500/50 scale-[1.01]'
        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
      } backdrop-blur-xl rounded-[2rem]`}>

      <CardContent className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div
          className="w-full h-full flex flex-col items-center justify-center cursor-pointer space-y-6"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-blue-500/20' : 'bg-white/5'
            }`}>
            <FileUp className={`w-10 h-10 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-400'
              }`} />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Upload your Resume</h3>
            <p className="text-gray-400">Drag & drop your PDF here or click to browse</p>
          </div>

          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">OR</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <Button
            variant="default"
            className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-xl font-bold text-lg shadow-lg shadow-white/5"
          >
            Select PDF File
          </Button>

          <p className="text-xs text-gray-600 mt-4">Supported format: PDF (Max 5MB)</p>

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