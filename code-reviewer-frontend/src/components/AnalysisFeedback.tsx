"use client"

import { Loader2 } from "lucide-react"

interface Analysis {
  file: string;
  analysis: {
    code: string;
    feedback: string;
  };
}

interface AnalysisFeedbackProps {
  currentFile?: string;
  analyses: Analysis[];
}

export const AnalysisFeedback: React.FC<AnalysisFeedbackProps> = ({ currentFile, analyses }) => {
  return (
    <div className="w-full h-full p-4 bg-background rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Code Analysis</h3>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto space-y-4">
        {currentFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing {currentFile}...</span>
          </div>
        )}
        {analyses.map((analysis, index) => (
          <div key={index} className="space-y-2 border-l-2 border-green-500 pl-4">
            <h4 className="text-sm font-medium text-foreground font-mono">{analysis.file}</h4>
            <div className="space-y-4">
              <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
                <code>{analysis.analysis.code}</code>
              </pre>
              <p className="text-sm text-muted-foreground">{analysis.analysis.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
