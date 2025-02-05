"use client"

import React from 'react';
import { User, GitBranch, Star } from "lucide-react"

interface RepoInfo {
  name: string
  description: string
  stars: number
  default_branch: string
}

interface UserInfo {
  login: string
  name: string
  public_repos: number
}

interface InfoPanelProps {
  data: {
    repo_info: RepoInfo
    user_info: UserInfo
  }
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ data }) => {
  const { repo_info, user_info } = data;

  return (
    <div className="w-full p-4 bg-background rounded-lg shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Repository Information</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Repository Details</h4>
          <div className="space-y-1 font-mono">
            <p className="text-xs">Name: {repo_info.name}</p>
            <p className="text-xs text-muted-foreground">{repo_info.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="h-3 w-3" />
              <span>{repo_info.stars}</span>
              <GitBranch className="h-3 w-3 ml-2" />
              <span>{repo_info.default_branch}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
          <div className="space-y-1 font-mono">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs">{user_info.name} ({user_info.login})</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Public repositories: {user_info.public_repos}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
