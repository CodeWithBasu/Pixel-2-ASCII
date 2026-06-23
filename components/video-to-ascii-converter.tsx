"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Video, Play, Square, Download, RefreshCw, CloudUpload } from "lucide-react"
import { toast } from "sonner"
import { useResponsive } from "@/hooks/use-responsive"

interface VideoToAsciiConverterProps {
  videoFile: File
  onReset: () => void
}

const CHARACTER_SETS = {
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  minimal: " .:",
  detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  binary: " 01",
  hex: " 0123456789ABCDEF",
  moons: " 🌑🌒🌓🌔🌕",
}

type CharSetKey = keyof typeof CHARACTER_SETS

export function VideoToAsciiConverter({ videoFile, onReset }: VideoToAsciiConverterProps) {
  const { isMobile, isTablet } = useResponsive()
  const [isPlaying, setIsPlaying] = useState(false)
  const [asciiFrames, setAsciiFrames] = useState<string[]>([])
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [width, setWidth] = useState([isMobile ? 40 : isTablet ? 60 : 80])
  const [viewMode, setViewMode] = useState<"controls" | "render">("render")
  const [fps, setFps] = useState([12])
  const [charSet, setCharSet] = useState<CharSetKey>("standard")

  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const convertFrameToAscii = useCallback((imageData: ImageData, width: number, charSetKey: CharSetKey) => {
    const chars = CHARACTER_SETS[charSetKey]
    const charArray = Array.from(chars)
    const { data } = imageData
    const height = Math.floor((imageData.height * width) / imageData.width * 0.55) // Keep aspect ratio compensation
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

        const charIndex = Math.floor((brightness / 255) * (charArray.length - 1))
        ascii += charArray[charIndex]
      }
      ascii += "\n"
    }

    return ascii
  }, [])

  const playAsciiVideo = useCallback(() => {
    if (asciiFrames.length === 0) return

    setIsPlaying(true)
    
    // Start from beginning if at the end
    if (currentFrame >= asciiFrames.length - 1) {
       setCurrentFrame(0)
    }

    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= asciiFrames.length - 1) {
          setIsPlaying(false)
          clearInterval(intervalRef.current)
          return prev
        }
        return prev + 1
      })
    }, 1000 / fps[0])
  }, [asciiFrames, fps, currentFrame])

  const stopAsciiVideo = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])

  const processVideo = useCallback(async () => {
    if (!videoRef.current) return

    if (isMobile) setViewMode("render")

    setIsProcessing(true)
    setProgress(0)
    setAsciiFrames([])
    setCurrentFrame(0)
    stopAsciiVideo()

    const video = videoRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })

    if (!ctx) return

    const frames: string[] = []
    const duration = video.duration
    
    // Safety check for duration
    if (isNaN(duration) || duration === 0) {
        setIsProcessing(false)
        return
    }
    
    const frameCount = Math.floor(duration * fps[0])

    // Optimize: process sequentially without heavily blocking the main thread if possible
    // For next-level this should move to a Web Worker, but for now we stagger with setTimeout
    const processFrame = async (i: number) => {
      if (i >= frameCount) {
          setAsciiFrames(frames)
          setIsProcessing(false)
          setProgress(100)
          return
      }

      const time = (i / frameCount) * duration
      video.currentTime = time

      await new Promise((resolve) => {
        video.onseeked = resolve
      })

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const asciiFrame = convertFrameToAscii(imageData, width[0], charSet)
      frames.push(asciiFrame)

      setProgress(Math.floor((i / frameCount) * 100))
      
      // Let render cycle breathe
      setTimeout(() => processFrame(i + 1), 0)
    }

    processFrame(0)
  }, [convertFrameToAscii, width, fps, stopAsciiVideo, charSet])

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
      // Trigger load to get duration
      videoRef.current.load()
      return () => URL.revokeObjectURL(url)
    }
  }, [videoFile])

  useEffect(() => {
    // Auto play when processing finishes
    if (asciiFrames.length > 0 && !isProcessing && currentFrame === 0) {
      setTimeout(() => {
        playAsciiVideo()
      }, 500)
    }
  }, [asciiFrames, isProcessing, playAsciiVideo, currentFrame])

  const downloadAsTextSequence = () => {
    // Basic export: all frames separated by a delimiter
    const text = asciiFrames.join("\n===FRAME_BREAK===\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pixel-2-ascii-video.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const archiveCurrentFrame = async () => {
    if (asciiFrames.length === 0) return
    
    setIsProcessing(true)
    const toastId = toast.loading("Capturing frame for cloud archive...")

    // Re-render current frame with colors for the cloud
    if (!videoRef.current) return
    
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Create a color data structure similar to ImageToAsciiConverter
    const targetWidth = width[0]
    const aspect = video.videoHeight / video.videoWidth
    const targetHeight = Math.floor(targetWidth * aspect * 0.55)
    
    const result: { char: string; color?: string }[][] = []
    for (let y = 0; y < targetHeight; y++) {
      const row: { char: string; color?: string }[] = []
      for (let x = 0; x < targetWidth; x++) {
        const srcX = Math.floor((x * imageData.width) / targetWidth)
        const srcY = Math.floor((y * imageData.height) / targetHeight)
        const index = (srcY * imageData.width + srcX) * 4
        
        const r = imageData.data[index]
        const g = imageData.data[index+1]
        const b = imageData.data[index+2]
        const avg = (r + g + b) / 3
        const charArray = Array.from(CHARACTER_SETS[charSet])
        const charIndex = Math.floor((avg / 255) * (charArray.length - 1))
        
        row.push({ 
          char: charArray[charIndex],
          color: `rgb(${r},${g},${b})`
        })
      }
      result.push(row)
    }

    try {
      const response = await fetch('/api/ascii', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Video_Frame_${Date.now().toString().slice(-4)}`,
          asciiData: result,
          isColor: true,
          settings: {
            width: width[0],
            fps: fps[0],
            source: videoFile.name
          }
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("ASCII video frame uploaded successfully to cloud", { 
          id: toastId,
          description: "Transmission archived in the community vault.",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(`Archive failed: ${error.message}`, { id: toastId })
    } finally {
       setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/20 overflow-hidden">
      {/* Mobile Toggle Bar */}
      {isMobile && (
        <div className="flex shrink-0 border-b border-white/10">
          <button 
            onClick={() => setViewMode("controls")}
            className={`flex-1 py-3 text-[10px] font-mono tracking-widest uppercase transition-colors ${viewMode === 'controls' ? 'bg-white text-black' : 'text-white/40 bg-black'}`}
          >
            CONTROLS
          </button>
          <button 
            onClick={() => setViewMode("render")}
            className={`flex-1 py-3 text-[10px] font-mono tracking-widest uppercase transition-colors ${viewMode === 'render' ? 'bg-white text-black' : 'text-white/40 bg-black'}`}
          >
            RENDER_VIEW
          </button>
        </div>
      )}

      {/* Sidebar Controls - HUD style */}
      <aside className={`${isMobile && viewMode !== 'controls' ? 'hidden' : 'flex'} w-full md:w-80 lg:w-96 shrink-0 bg-black flex flex-col h-auto md:h-full overflow-y-auto custom-scrollbar p-6 border-r border-white/10 uppercase tracking-tighter`}>
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 text-white">
                <Video className="w-5 h-5"/>
                <h2 className="font-bold text-xl">Video_Core</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 rounded-none text-white/40 hover:bg-white hover:text-black transition-colors">
                <X className="w-4 h-4"/>
            </Button>
        </div>

        <div className="space-y-8 flex-1">
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-mono text-muted-foreground">
                    <span>Resolution Width</span>
                    <span className="text-primary">{width[0]} chars</span>
                </div>
                <Slider value={width} onValueChange={setWidth} min={40} max={120} step={4} className="py-2" disabled={isProcessing} />
            </div>

            <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">Character Dictionary</div>
                <Select value={charSet} onValueChange={(v: CharSetKey) => setCharSet(v)} disabled={isProcessing}>
                  <SelectTrigger className="bg-background/80 border-border font-mono text-sm h-10 rounded-none shadow-none focus:ring-1 focus:ring-primary/50">
                    <SelectValue placeholder="Select set" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border rounded-none">
                    <SelectItem value="standard" className="rounded-none cursor-pointer">Standard <span className="text-primary/50 ml-2">.:-=+*#%@</span></SelectItem>
                    <SelectItem value="detailed" className="rounded-none cursor-pointer">Detailed <span className="text-primary/50 ml-2">70+ chars</span></SelectItem>
                    <SelectItem value="blocks" className="rounded-none cursor-pointer">Blocks <span className="text-primary/50 ml-2">░▒▓█</span></SelectItem>
                    <SelectItem value="minimal" className="rounded-none cursor-pointer">Minimal <span className="text-primary/50 ml-2">.:</span></SelectItem>
                    <SelectItem value="binary" className="rounded-none cursor-pointer">Binary <span className="text-primary/50 ml-2">01</span></SelectItem>
                    <SelectItem value="hex" className="rounded-none cursor-pointer">Hex <span className="text-primary/50 ml-2">0-F</span></SelectItem>
                    <SelectItem value="moons" className="rounded-none cursor-pointer">Moons <span className="text-primary/50 ml-2">🌑-🌕</span></SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-mono text-muted-foreground">
                    <span>Target Extraction fps</span>
                    <span className="text-primary">{fps[0]} fps</span>
                </div>
                <Slider value={fps} onValueChange={setFps} min={5} max={24} step={1} className="py-2" disabled={isProcessing} />
                <p className="text-[10px] text-muted-foreground font-mono mt-1 leading-tight">Higher FPS exponentially increases processing time.</p>
            </div>

            <div className="h-px bg-border/50 w-full my-4"></div>

            <Button 
                onClick={processVideo}
                disabled={isProcessing}
                className={`w-full btn-terminal h-12 uppercase tracking-widest ${isProcessing ? 'border-primary text-primary bg-primary/10' : ''}`}
                variant="outline"
            >
                {isProcessing ? 'EXTRACTING FRAMES...' : 'INITIALIZE BUFFER'}
            </Button>
            
            {isProcessing && (
                <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-[10px] font-mono tracking-widest text-primary">
                        <span>SYS.MEM.ALLOC</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-border overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    {/* Matrix-like decorative text */}
                    <div className="text-[8px] font-mono text-primary/40 break-all leading-none opacity-50 overflow-hidden h-12">
                        {Array(100).fill(0).map(() => Math.random().toString(36).substring(2, 3)).join('')}
                    </div>
                </div>
            )}

            <Button 
                variant="ghost" 
                onClick={() => {
                   setWidth([80])
                   setFps([12])
                   setCharSet("standard")
                   stopAsciiVideo()
                   setAsciiFrames([])
                   setCurrentFrame(0)
                }}
                className="w-full h-8 text-[9px] tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 rounded-none mt-4 transition-all"
            >
                CLEAR_BUFFER_&_RESET_SYSTEM
            </Button>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-white/20 mt-8 grid grid-cols-2 gap-3 relative z-10">
            <Button onClick={isPlaying ? stopAsciiVideo : playAsciiVideo} disabled={asciiFrames.length === 0} variant="outline" className={`btn-terminal py-4 h-auto flex flex-col gap-2 rounded-none bg-black border-white/20 transition-all hover:bg-white group ${isPlaying ? 'bg-white text-black' : ''}`}>
                {isPlaying ? <Square className={`h-4 w-4 ${isPlaying ? "text-black" : "text-white group-hover:text-black"}`} /> : <Play className="h-4 w-4 ml-1 text-white group-hover:text-black" />}
                <span className={`text-[10px] tracking-widest ${isPlaying ? "text-black" : "text-white group-hover:text-black"}`}>{isPlaying ? 'HALT' : 'PLAY'}</span>
            </Button>
            <Button onClick={downloadAsTextSequence} disabled={asciiFrames.length === 0 || isProcessing} variant="outline" className="btn-terminal py-4 h-auto flex flex-col gap-2 rounded-none bg-black border-white/20 transition-all hover:bg-white group disabled:opacity-50">
                <Download className="h-4 w-4 text-white group-hover:text-black" /> 
                <span className="text-[10px] tracking-widest text-white group-hover:text-black">EXPORT</span>
            </Button>
            <Button onClick={archiveCurrentFrame} disabled={asciiFrames.length === 0 || isProcessing} variant="outline" className="col-span-2 btn-terminal py-4 h-auto flex gap-3 items-center justify-center rounded-none bg-black border-white/20 hover:bg-white group transition-all">
                <CloudUpload className={`h-4 w-4 text-white group-hover:text-black ${isProcessing ? 'animate-pulse' : ''}`} /> 
                <span className="text-[10px] tracking-[0.3em] text-white group-hover:text-black">ARCHIVE_CURRENT_FRAME</span>
            </Button>
        </div>
      </aside>

      {/* Main ASCII Canvas Viewport */}
      <main className={`${isMobile && viewMode !== 'render' ? 'hidden' : 'flex'} flex-1 bg-black overflow-hidden relative flex flex-col`}>
        {/* Viewport Header */}
        <div className="h-10 bg-black border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex gap-4">
                <div className="flex gap-1.5 items-center">
                   <div className={`w-2 h-2 ${isPlaying ? 'bg-white' : 'bg-white/20'}`}></div>
                   <div className={`w-2 h-2 ${isPlaying ? 'bg-white' : 'bg-white/40'}`}></div>
                   <div className={`w-2 h-2 ${isPlaying ? 'bg-white' : 'bg-white/60'}`}></div>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-white/40 ml-2">
                    {asciiFrames.length > 0 ? `SEQ_${currentFrame + 1}/${asciiFrames.length}` : 'AWAITING_DATA'}
                </div>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-muted-foreground">
                <span className="opacity-50 mr-2">{videoFile.name} //</span>
                {videoRef.current ? `${videoRef.current.duration.toFixed(1)}s` : '0.0s'}
            </div>
        </div>
        
        {/* Terminal Text Area */}
        <div 
          className="flex-1 overflow-auto bg-black p-4 relative flex items-center justify-center custom-scrollbar"
          style={{ 
            fontSize: isMobile ? '0.35rem' : isTablet ? '0.5rem' : '0.65rem'
          }}
        >
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

             {asciiFrames.length > 0 ? (
                <div className="ascii-art cursor-default select-none border border-white/5 p-4 bg-black mx-auto">
                   <pre className="font-mono leading-[0.8] whitespace-pre select-none grayscale contrast-125">
                     {asciiFrames[currentFrame]}
                   </pre>
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-primary/50 font-mono text-sm tracking-widest min-h-[300px]">
                  {isProcessing ? (
                      <div className="flex flex-col items-center gap-4">
                          <RefreshCw className="h-8 w-8 animate-spin" />
                          <span>EXTRACTING_MATRIX_DATA // {progress}%</span>
                      </div>
                  ) : "SYSTEM_STANDBY"}
                </div>
              )}
        </div>
      </main>

      {/* Hidden processing elements */}
      <video ref={videoRef} className="hidden" muted preload="metadata" />
    </div>
  )
}
