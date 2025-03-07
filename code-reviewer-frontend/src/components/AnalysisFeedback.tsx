"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Updated interface for simplified analysis format
interface Analysis {
  file: string
  analysis: string // Now just a string containing all analysis text
}

interface AnalysisFeedbackProps {
  currentFile?: string
  selectedFile?: string
  analyses: Analysis[]
}

// Configure markdown components with proper handling for code blocks
const markdownComponents = {
  p: ({ children }) => <div className="mb-3 last:mb-0">{children}</div>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  // Handle code blocks properly
  code: ({ inline, className, children }) => {
    const match = /language-(\w+)/.exec(className || '');
    
    if (inline) {
      return <code className="px-1 py-0.5 bg-muted rounded font-mono text-sm">{children}</code>;
    }
    
    return (
      <div className="my-3 rounded-md overflow-hidden">
        <SyntaxHighlighter
          language={match?.[1] || 'java'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            borderRadius: "0.375rem",
          }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  },
};

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ 
  currentFile, 
  selectedFile,
  analyses 
}) => {
  // Get only the selected file's analysis
  const selectedAnalysis = selectedFile 
    ? analyses.find(a => a.file.split('/').pop() === selectedFile)
    : null;

  // Convert analysis content to string, handling different formats
  const getAnalysisContent = (analysis: any): string => {
    if (!analysis) return '';
    
    // If it's already a string
    if (typeof analysis === 'string') return analysis;
    
    // If it's an object, try to stringify it
    if (typeof analysis === 'object') {
      try {
        return JSON.stringify(analysis, null, 2);
      } catch (e) {
        console.error('Failed to stringify analysis:', e);
        return 'Error: Could not parse analysis data';
      }
    }
    
    // Fallback
    return String(analysis);
  };

  return (
    <div className="w-full h-full p-4 bg-background rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        {selectedFile ? `Analysis: ${selectedFile}` : 'Code Analysis'}
      </h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {currentFile && currentFile === selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing {currentFile}...</span>
          </div>
        )}
        
        {selectedAnalysis && (
          <div className="text-sm text-muted-foreground p-3 rounded bg-muted/30 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {getAnalysisContent(selectedAnalysis.analysis)}
            </ReactMarkdown>
          </div>
        )}

        {!currentFile && !selectedAnalysis && (
          <div className="text-center text-muted-foreground">
            {selectedFile 
              ? "Analysis not available for this file yet"
              : "Select a file to view its analysis"}
          </div>
        )}
      </div>
    </div>
  )
}

