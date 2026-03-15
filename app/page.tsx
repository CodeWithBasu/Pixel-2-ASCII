"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VideoToAsciiConverter } from "@/components/video-to-ascii-converter"
import { TerminalHeader } from "@/components/terminal-header"
import { TerminalFrame } from "@/components/terminal-frame"

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <TerminalHeader />

      <main className="container mx-auto px-4 py-4 md:px-6 md:py-8">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-1 md:space-y-2">
              <h1 className="text-2xl md:text-4xl font-mono tracking-tight text-foreground">
                Video to ASCII Converter
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-mono">
                Transform video files into ASCII art animations
              </p>
            </div>

            <div className="h-px bg-border w-full"></div>
          </div>

          {!videoFile && (
            <Card className="border-border bg-card">
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <TerminalFrame title="">
                  <video
                    className="w-full max-w-2xl mx-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ imageRendering: "pixelated" }}
                  >
                    <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RPReplay_Final1758943384-lFlOhPjiu0rgv5mbWLixF6xIQk8pUX.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </TerminalFrame>
              </div>
            </Card>
          )}

          {!videoFile && (
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-card"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="p-8 md:p-12 text-center space-y-4 md:space-y-6">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto border border-border flex items-center justify-center">
                  <div className="text-xl md:text-2xl font-mono text-muted-foreground">+</div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-lg md:text-xl font-mono text-foreground">Drop video file here</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-mono">
                    Supports MP4, WebM, MOV, and AVI formats
                  </p>
                </div>

                <Button className="btn-terminal bg-transparent" variant="outline">
                  Select File
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
            </Card>
          )}

          {/* Video Converter */}
          {videoFile && <VideoToAsciiConverter videoFile={videoFile} onReset={() => setVideoFile(null)} />}
        </div>
      </main>
    </div>
  )
}
