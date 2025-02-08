"use client"

import type React from "react"
import { Loader2, File } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface CodeFeedback {
  code: string
  feedback: string
}

interface Analysis {
  file: string
  analysis: CodeFeedback[] // Changed from string to CodeFeedback[]
}

interface AnalysisFeedbackProps {
  currentFile?: string
  selectedFile?: string
  analyses: Analysis[]
}

const markdownComponents = {
  // Use divs instead of p tags to avoid nesting issues
  p: ({ children }) => <div className="mb-3 last:mb-0">{children}</div>,
  // Simple styling for other markdown elements
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
  // Simple inline code styling
  code: ({ children }) => (
    <code className="px-1 py-0.5 bg-muted rounded font-mono text-sm">
      {children}
    </code>
  ),
};

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ 
  currentFile, 
  selectedFile,
  analyses 
}) => {
  const parseAnalysis = (analysisData: any): CodeFeedback[] => {
    if (!analysisData) return [];
    
    // If it's already an array, return it
    if (Array.isArray(analysisData)) return analysisData;
    
    // If it's an object with 'analysis' property that contains the array
    if (analysisData.analysis && Array.isArray(analysisData.analysis)) {
      return analysisData.analysis;
    }

    console.log('Unexpected analysis format:', analysisData);
    return [];
  };

  console.log('AnalysisFeedback received analyses:', analyses);

  // Get only the selected file's analysis
  const selectedAnalysis = selectedFile 
    ? analyses.find(a => a.file.split('/').pop() === selectedFile)
    : null;

  return (
    <div className="w-full h-full p-4 bg-background rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        {selectedFile ? `Analysis: ${selectedFile}` : 'Code Analysis'}
      </h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
        {currentFile && currentFile === selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing {currentFile}...</span>
          </div>
        )}
        
        {selectedAnalysis && (
          <div className="space-y-6">
            {parseAnalysis(selectedAnalysis.analysis).map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-3 pl-4 border-l border-muted">
                <div className="rounded-md overflow-hidden">
                  <SyntaxHighlighter
                    language="java"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      fontSize: "0.875rem",
                      borderRadius: "0.375rem",
                    }}
                  >
                    {item.code}
                  </SyntaxHighlighter>
                </div>
                <div className="text-sm text-muted-foreground p-3 rounded bg-muted/30">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {item.feedback}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
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

