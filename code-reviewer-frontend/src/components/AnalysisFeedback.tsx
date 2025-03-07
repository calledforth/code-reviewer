"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface AnalysisFeedbackProps {
  currentFile?: string
  selectedFile?: string
  analyses: Record<string, string>
}

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ 
  currentFile, 
  selectedFile,
  analyses 
}) => {
  // Get the analysis content for the selected file
  const selectedAnalysisContent = selectedFile ? analyses[selectedFile] : undefined

  return (
    <div className="w-full h-full px-6 py-4 bg-neutral-950 text-white rounded border">
      <h3 className="text-lg font-medium mb-3">
        {selectedFile ? `Analysis: ${selectedFile}` : 'Code Analysis'}
      </h3>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
        {/* Loading state */}
        {currentFile && currentFile === selectedFile && (
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing {currentFile}...</span>
          </div>
        )}
        
        {/* Analysis content with syntax highlighting */}
        {selectedFile && selectedAnalysisContent && (
          <div className="prose prose-sm prose-invert max-w-none overflow-hidden">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      wrapLongLines={true}
                      customStyle={{ maxWidth: '100%'}}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-neutral-800 px-1 py-0.5 rounded text-white" {...props}>
                      {children}
                    </code>
                  );
                },
                p({children}) {
                  return <p className="text-gray-300">{children}</p>;
                },
                strong({children}) {
                  return <strong className="text-white font-bold">{children}</strong>;
                },
                ul({children}) {
                  return <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>;
                },
                ol({children}) {
                  return <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>;
                },
                li({children}) {
                  return <li className="text-gray-300">{children}</li>;
                },
                h1({children}) {
                  return <h1 className="text-white text-2xl font-bold mt-6 mb-4">{children}</h1>;
                },
                h2({children}) {
                  return <h2 className="text-white text-xl font-bold mt-5 mb-3">{children}</h2>;
                },
                h3({children}) {
                  return <h3 className="text-white text-lg font-bold mt-4 mb-2">{children}</h3>;
                },
                blockquote({children}) {
                  return <blockquote className="border-l-4 border-gray-600 pl-4 py-1 text-gray-400 italic my-4">{children}</blockquote>;
                },
              }}
            >
              {selectedAnalysisContent}
            </ReactMarkdown>
          </div>
        )}
        
        {/* Empty state */}
        {!currentFile && !selectedAnalysisContent && (
          <p className="text-gray-400 text-center">
            {selectedFile 
              ? "No analysis available yet"
              : "Select a file to view its analysis"}
          </p>
        )}
      </div>
    </div>
  )
}