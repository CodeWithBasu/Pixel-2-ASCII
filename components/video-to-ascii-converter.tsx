"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface VideoToAsciiConverterProps {
  videoFile: File
  onReset: () => void
}

const ASCII_CHARS = " .:-=+*#%@"

export function VideoToAsciiConverter({ videoFile, onReset }: VideoToAsciiConverterProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [asciiFrames, setAsciiFrames] = useState<string[]>([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [width, setWidth] = useState([90])
  const [fps, setFps] = useState([10])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const convertFrameToAscii = useCallback((imageData: ImageData, width: number) => {
    const { data } = imageData
    const height = Math.floor((imageData.height * width) / imageData.width / 2)
    let ascii = ""

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcX = Math.floor((x * imageData.width) / width)
        const srcY = Math.floor((y * imageData.height) / height)
        const index = (srcY * imageData.width + srcX) * 4

        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const brightness = (r + g + b) / 3

        const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))
        ascii += ASCII_CHARS[charIndex]
      }
      ascii += "\n"
    }

    return ascii
  }, [])

  const playAsciiVideo = useCallback(() => {
    if (asciiFrames.length === 0) return

    setIsPlaying(true)
    setCurrentFrame(0)

    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= asciiFrames.length - 1) {
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 1000 / fps[0])
  }, [asciiFrames, fps])

  const stopAsciiVideo = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const processVideo = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    setProgress(0)

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const frames: string[] = []
    const duration = video.duration
    const frameCount = Math.floor(duration * fps[0])

    for (let i = 0; i < frameCount; i++) {
      const time = (i / frameCount) * duration
      video.currentTime = time

      await new Promise((resolve) => {
        video.onseeked = resolve
      })

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const asciiFrame = convertFrameToAscii(imageData, width[0])
      frames.push(asciiFrame)

      setProgress(Math.floor((i / frameCount) * 100))
    }

    setAsciiFrames(frames)
    setIsProcessing(false)
    setProgress(100)
  }, [convertFrameToAscii, width, fps])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (videoFile && videoRef.current) {
      const url = URL.createObjectURL(videoFile)
      videoRef.current.src = url
      return () => URL.revokeObjectURL(url)
    }
  }, [videoFile])

  useEffect(() => {
    if (asciiFrames.length > 0 && !isProcessing) {
      setTimeout(() => {
        playAsciiVideo()
      }, 500)
    }
  }, [asciiFrames, isProcessing, playAsciiVideo])

  return (
    <div className="space-y-8">
      <Card className="border-border bg-card">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-mono tracking-wide text-foreground">Processing Controls</h2>
            <div className="text-xs text-muted-foreground font-mono">{videoFile.name}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-mono text-muted-foreground tracking-wide">
                Width: {width[0]} characters
              </label>
              <Slider value={width} onValueChange={setWidth} min={40} max={120} step={10} className="w-full" />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono text-muted-foreground tracking-wide">Frame Rate: {fps[0]} fps</label>
              <Slider value={fps} onValueChange={setFps} min={5} max={30} step={5} className="w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            <Button
              onClick={processVideo}
              disabled={isProcessing}
              className="btn-terminal bg-transparent"
              variant="outline"
            >
              {isProcessing ? `Processing ${progress}%` : "Convert to ASCII"}
            </Button>

            {asciiFrames.length > 0 && (
              <>
                <Button
                  onClick={isPlaying ? stopAsciiVideo : playAsciiVideo}
                  className="btn-terminal bg-transparent"
                  variant="outline"
                >
                  {isPlaying ? "Stop" : "Play"}
                </Button>

                <Button onClick={onReset} className="btn-terminal bg-transparent" variant="outline">
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {asciiFrames.length > 0 && (
        <Card className="border-border bg-card">
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-mono tracking-wide text-foreground">ASCII Output</h2>
              <div className="text-sm font-mono text-muted-foreground">
                Frame {currentFrame + 1} of {asciiFrames.length}
              </div>
            </div>

            <div className="bg-background border border-border p-6 overflow-auto terminal-grid">
              <pre className="ascii-art text-primary leading-none">{asciiFrames[currentFrame] || "No frame data"}</pre>
            </div>
          </div>
        </Card>
      )}

      {/* Hidden processing elements */}
      <video ref={videoRef} className="hidden" muted preload="metadata" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
