'use client'

import { InfoPanel } from '@/components/InfoPanel'
import { FileStructureView } from '@/components/FileStructureView'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnalysisFeedback } from '@/components/AnalysisFeedback'

interface ReviewData {
  type: 'status' | 'contents' | 'error' | 'analysis_start' | 'analysis_complete';
  data?: any;
  message?: string;
  file?: string;
  analysis?: any;
}

export default function ReviewPage() {
  const searchParams = useSearchParams()
  const repoUrl = searchParams.get('url')
  const token = searchParams.get('token')
  const initialInfoParam = searchParams.get('initialInfo')
  
  const [initialInfo, setInitialInfo] = useState<any>(null)
  const [status, setStatus] = useState<string>('')
  const [contents, setContents] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isExtracting, setIsExtracting] = useState(true)
  const [activeAnalysisFile, setActiveAnalysisFile] = useState<string | undefined>()
  const [analyses, setAnalyses] = useState<Record<string, string>>({})
  const [processedFiles, setProcessedFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string | undefined>()

  useEffect(() => {
    if (initialInfoParam) {
      try {
        setInitialInfo(JSON.parse(decodeURIComponent(initialInfoParam)))
      } catch (err) {
        console.error('Failed to parse initial info:', err)
      }
    }
  }, [initialInfoParam])

  useEffect(() => {
    if (!repoUrl || !token) return;

    const eventSource = new EventSource(
      `http://127.0.0.1:5000/api/review/stream?url=${encodeURIComponent(repoUrl)}&token=${encodeURIComponent(token)}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data: ReviewData = JSON.parse(event.data);
        console.log('Received event:', data); // Debug log
        
        switch (data.type) {
          case 'status':
            setStatus(data.message || '');
            // Check if this is a completion message
            if (data.message?.toLowerCase().includes('completed')) {
              setIsCompleted(true);
              eventSource.close();
            }
            break;
          case 'contents':
            setContents(data.data);
            setIsExtracting(false); // Turn off loading state when contents received
            break;
          case 'error':
            throw new Error(data.message || 'An error occurred');
          case 'analysis_start':
            const fileName = data.file?.split('/').pop();
            setActiveAnalysisFile(fileName);
            setSelectedFile(fileName);
            break;
          case 'analysis_complete':
            console.log('Analysis complete data received:', {
              file: data.file,
              analysis: data.analysis
            });
            setActiveAnalysisFile(undefined);
            const completedFileName = data.file?.split('/').pop() || '';
            // Store full path instead of just file name
            setProcessedFiles(prev => [...prev, completedFileName]);
            // Store analysis by filename in the analyses state
            setAnalyses(prev => ({
              ...prev,
              [completedFileName]: data.analysis
            }));
            break;
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      // Only set error if we haven't completed successfully
      if (!isCompleted) {
        console.error('SSE Error:', err);
        setError('Connection error');
      }
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [repoUrl, token]);

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden p-4 flex flex-col">
      <div className="flex-none">
        <h1 className="text-2xl font-bold mb-4">Code Review Results</h1>
        {status && (
          <div className={`text-sm ${isCompleted ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
            {status}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden grid grid-cols-[400px_1fr] gap-6 mt-4">
        <div className="space-y-6 overflow-y-auto pr-2">
          {initialInfo && <InfoPanel data={initialInfo} />}
          <FileStructureView 
            data={contents} 
            isLoading={isExtracting}
            activeAnalysisFile={activeAnalysisFile}
            processedFiles={processedFiles}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </div>
        <div className="h-[calc(100vh-150px)]">
          <AnalysisFeedback 
            currentFile={activeAnalysisFile}
            analyses={analyses}
            selectedFile={selectedFile}
          />
        </div>
      </div>
    </div>
  );
}
