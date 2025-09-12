import { Suspense } from 'react';
import { ResumeViewer } from '@/components/resume-viewer';

interface ResumePageProps {
  params: {
    path: string[];
  };
}

export default function ResumePage({ params }: ResumePageProps) {
  const filePath = params.path.join('/');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading resume...</div>}>
        <ResumeViewer filePath={filePath} />
      </Suspense>
    </div>
  );
}
