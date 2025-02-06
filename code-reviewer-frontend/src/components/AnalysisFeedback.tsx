"use client"

import type React from "react"
import { Loader2, File } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeFeedback {
  code: string
  feedback: string
}

interface Analysis {
  file: string
  analysis: string // JSON string
}

interface AnalysisFeedbackProps {
  currentFile?: string
  analyses: Analysis[]
}

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ currentFile, analyses }) => {
  return (
    <div className="w-full h-full p-4 bg-background rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Code Analysis</h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
        {currentFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing {currentFile}...</span>
          </div>
        )}
        {analyses.map((analysis, index) => {
          const parsedAnalysis: CodeFeedback[] = JSON.parse(analysis.analysis)
          return (
            <div key={index} className="space-y-4 border-l-2 border-green-500 pl-4">
              <h4 className="text-sm font-medium text-foreground font-mono flex items-center gap-2">
                <File className="h-4 w-4" />
                {analysis.file}
              </h4>
              <div className="space-y-6">
                {parsedAnalysis.map((item, itemIndex) => (
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
                    <div className="text-sm text-muted-foreground p-3 rounded bg-muted/30">{item.feedback}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {!currentFile && analyses.length === 0 && (
          <div className="text-center text-muted-foreground">No analysis available. Select a file to begin.</div>
        )}
      </div>
    </div>
  )
}

