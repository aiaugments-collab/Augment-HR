"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink, FileText } from 'lucide-react';

interface ResumeViewerProps {
  filePath: string;
}

export function ResumeViewer({ filePath }: ResumeViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fileUrl = `/api/files/${filePath}`;
  const fileName = filePath.split('/').pop() || 'resume';
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  const renderViewer = () => {
    if (fileExtension === 'pdf') {
      return (
        <div className="w-full h-[80vh] border rounded-lg overflow-hidden">
          <iframe
            src={fileUrl}
            className="w-full h-full"
            title={`Resume: ${fileName}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError('Failed to load PDF');
              setIsLoading(false);
            }}
          />
        </div>
      );
    }
    
    // For DOC/DOCX files, show download option
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>Document Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            This document type cannot be previewed in the browser.
          </p>
          <p className="font-medium">{fileName}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleOpenInNewTab} className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Open
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <div className="text-red-500 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Error Loading Resume</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resume Viewer</h1>
          <p className="text-muted-foreground">{fileName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleOpenInNewTab} className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading resume...</p>
          </div>
        </div>
      )}

      {/* Viewer */}
      <div className={isLoading ? 'hidden' : ''}>
        {renderViewer()}
      </div>
    </div>
  );
}
