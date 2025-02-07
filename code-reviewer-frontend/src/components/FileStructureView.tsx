"use client"

import type * as React from "react"
import { Circle, File, Loader2, CheckCircle2 } from "lucide-react"

interface FileData {
  name: string
  path: string
  type: string
  content: string
}

interface FileStructureProps {
  data?: FileData[] | { contents: FileData[] }
  isLoading?: boolean
  activeAnalysisFile?: string
  processedFiles?: string[]
  selectedFile?: string
  onFileSelect: (fileName: string) => void
}

export const FileStructureView: React.FC<FileStructureProps> = ({ 
  data, 
  isLoading = false, 
  activeAnalysisFile,
  processedFiles = [],
  selectedFile,
  onFileSelect
}) => {
  if (isLoading) {
    return (
      <div className="w-full p-4 bg-background rounded-lg shadow-lg border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">File Analysis</h3>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Extracting repository files...</p>
        </div>
      </div>
    )
  }

  const files = data ? (Array.isArray(data) ? data : data.contents) : []

  const getFileStyles = (file: FileData) => {
    const fileName = file.path.split('/').pop() || file.name;
    if (activeAnalysisFile === fileName) {
      return "text-cyan-500 animate-pulse"
    }
    if (processedFiles.includes(fileName)) {
      return "text-green-500"
    }
    return "text-muted-foreground"
  }

  return (
    <div className="w-full p-4 bg-background rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">File Analysis</h3>
      <div className="max-h-[600px] overflow-y-auto relative">
        <div className="space-y-2">
          {files.map((file, index) => {
            const fileName = file.path.split('/').pop() || file.name;
            const isProcessing = activeAnalysisFile === fileName;
            const isProcessed = processedFiles.includes(fileName);

            return (
              <div 
                key={index} 
                className="flex items-start gap-3 relative group"
                onClick={() => onFileSelect(fileName)}
              >
                <div className="flex flex-col items-center">
                  <Circle 
                    className={`h-2 w-2 ${
                      isProcessing 
                        ? "fill-cyan-500/20 text-cyan-500 ring-2 ring-cyan-500/50 animate-pulse" 
                        : isProcessed
                          ? "fill-green-500 text-green-500"
                          : "fill-muted-foreground text-muted-foreground"
                    } transition-all duration-300`} 
                  />
                  {index !== files.length - 1 && (
                    <div className={`w-[2px] h-full absolute top-3 ${
                      isProcessing 
                        ? "bg-cyan-500/20" 
                        : isProcessed
                          ? "bg-green-500/20"
                          : "bg-muted-foreground/20"
                    } transition-colors`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className={`flex items-center gap-2 text-sm font-mono ${getFileStyles(file)}`}>
                    <File className="h-4 w-4" />
                    <span className="font-medium cursor-pointer hover:underline">{file.name}</span>
                    {isProcessing && (
                      <Loader2 className="h-3 w-3 animate-spin text-cyan-500" />
                    )}
                    {isProcessed && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground/60 font-mono mt-1">{file.path}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

