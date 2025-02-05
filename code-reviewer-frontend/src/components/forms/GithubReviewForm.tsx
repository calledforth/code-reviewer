'use client'

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react"
import React, { useState } from "react";
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { GithubFormData } from "@/types/form";

export const GithubReviewForm = () => {
  const [fileName, setFileName] = React.useState<string>("")
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<GithubFormData>({
    defaultValues: {
      githubUrl: "",
      guidelinesFile: null,
      accessToken: "",
    },
  });

  const onSubmit = async (data: GithubFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      const formData = new FormData()
      formData.append('githubUrl', data.githubUrl)
      formData.append('accessToken', data.accessToken)
      if (data.guidelinesFile) {
        formData.append('guidelines', data.guidelinesFile)
      }

      const response = await axios.post('http://127.0.0.1:5000/api/review/init', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      const searchParams = new URLSearchParams({
        url: data.githubUrl,
        token: data.accessToken,
        initialInfo: encodeURIComponent(JSON.stringify({
          user_info: response.data.user_info,
          repo_info: response.data.repo_info,
          status: response.data.status
        }))
      })
      
      router.push(`/review?${searchParams.toString()}`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred'
      setError(errorMessage)
      console.error('Submission error:', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div className="w-full max-w-md p-6 rounded-lg border border-border shadow-sm hover:border-primary/20 transition-colors font-sans">
      <h2 className="text-2xl font-semibold mb-6">Review your Github Repository</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* GitHub URL Field */}
          <FormField
            control={form.control}
            name="githubUrl"
            rules={{ required: "GitHub URL is required" }}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">GitHub Repository URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://github.com/username/repo" 
                    {...field} 
                    className="p-3 transition-colors hover:border-primary focus-visible:ring-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Access Token Field */}
          <FormField
            control={form.control}
            name="accessToken"
            rules={{ required: "GitHub access token is required" }}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">GitHub Access Token</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="Enter your GitHub access token" 
                    {...field} 
                    className="p-3 transition-colors hover:border-primary focus-visible:ring-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Guidelines File Upload */}
          <FormField
            control={form.control}
            name="guidelinesFile"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">Upload Company Guidelines (Optional)</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-4">
                    <Input 
                      type="file" 
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        field.onChange(file)
                        setFileName(file?.name || "")
                      }}
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent cursor-pointer transition-colors"
                    >
                      <Upload className="h-5 w-5" />
                      <span>Choose File</span>
                    </label>
                    {fileName && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {fileName}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-auto text-base px-8 py-3 relative transition-all duration-300 ease-out
                active:scale-95 
                hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] 
                hover:border-orange-600
                dark:hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]
                before:content-['']
                before:absolute
                before:w-full
                before:h-full
                before:scale-x-0
                before:opacity-70
                hover:before:scale-x-100
                before:transition-transform
                before:duration-300
                overflow-hidden"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                'Submit for Review'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
