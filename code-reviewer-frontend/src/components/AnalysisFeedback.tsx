"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AnalysisFeedbackProps {
  currentFile?: string
  selectedFile?: string
  analyses: string
}

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ 
  currentFile, 
  selectedFile,
  analyses 
}) => {
  // Find the analysis for the selected file
  const selectedAnalysisItem = selectedFile 

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-black rounded border">
      <h3 className="text-lg font-medium mb-3">
        {selectedFile ? `Analysis: ${selectedFile}` : 'Code Analysis'}
      </h3>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden break-words whitespace-normal">
        {/* Loading state */}
        {currentFile && currentFile === selectedFile && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing {currentFile}...</span>
          </div>
        )}
        
        {/* Analysis content - simplified to just use ReactMarkdown */}
        {selectedAnalysisItem && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analyses}
            </ReactMarkdown>
          </div>
        )}
        
        {/* Empty state */}
        {!currentFile && !selectedAnalysisItem && (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {selectedFile 
              ? "No analysis available yet"
              : "Select a file to view its analysis"}
          </p>
        )}
      </div>
    </div>
  )
}