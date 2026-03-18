"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Share2, RefreshCw, X, Image as ImageIcon, CloudUpload } from "lucide-react"
import { toast } from "sonner"
import { useResponsive } from "@/hooks/use-responsive"

interface ImageToAsciiConverterProps {
  imageFile: File
  onReset: () => void
}

const CHARACTER_SETS = {
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  minimal: " .:",
  detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
}

type CharSetKey = keyof typeof CHARACTER_SETS

export function ImageToAsciiConverter({ imageFile, onReset }: ImageToAsciiConverterProps) {
  const { isMobile, isTablet } = useResponsive()
  const [asciiData, setAsciiData] = useState<{ char: string; color?: string }[][]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [width, setWidth] = useState([120]) // Default, will be adjusted by useEffect
  const [charSet, setCharSet] = useState<CharSetKey>("standard")
  const [invert, setInvert] = useState(false)
  const [grayscale, setGrayscale] = useState(false)
  const [edgeDetect, setEdgeDetect] = useState(false) // New feature toggle
  const [contrast, setContrast] = useState([20]) // Default boosted slightly for deeper ASCII feel
  const [brightness, setBrightness] = useState([0])
  const [viewMode, setViewMode] = useState<"controls" | "render">("render")
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)

  const imageRef = useRef<HTMLImageElement>(null)

  // Sync width with device type on mount/change
  useEffect(() => {
    const targetWidth = isMobile ? 60 : isTablet ? 100 : 120
    if (width[0] !== targetWidth) {
      setWidth([targetWidth])
    }
  }, [isMobile, isTablet])

  const processImage = useCallback(() => {
    if (!loadedImage) return

    if (loadedImage.width === 0 || loadedImage.height === 0) {
      console.warn("Image not fully initialized by mobile browser yet.")
      return
    }

    setIsProcessing(true)
    
    // Yield to the main thread so mobile browsers can render the "PROCESSING..." UI
    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) {
          setIsProcessing(false)
          return
        }

        const aspect = loadedImage.height / loadedImage.width
        const targetWidth = Math.max(1, width[0])
        const targetHeight = Math.max(1, Math.floor(targetWidth * aspect * 0.55))

        canvas.width = targetWidth
        canvas.height = targetHeight

        try {
          ctx.filter = `brightness(${100 + brightness[0]}%) contrast(${100 + contrast[0]}%)`
        } catch (e) {}
        
        ctx.drawImage(loadedImage, 0, 0, targetWidth, targetHeight)

        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
        const { data } = imageData
      const chars = CHARACTER_SETS[charSet]
      const result: { char: string; color?: string }[][] = []

      for (let y = 0; y < targetHeight; y++) {
        const row: { char: string; color?: string }[] = []
        for (let x = 0; x < targetWidth; x++) {
          const i = (y * targetWidth + x) * 4
          let r = data[i]
          let g = data[i + 1]
          let b = data[i + 2]

          if (edgeDetect && x > 0 && y > 0) {
              const topI = ((y-1) * targetWidth + x) * 4
              const leftI = (y * targetWidth + (x-1)) * 4
              const diff = Math.abs(r - data[leftI]) + Math.abs(r - data[topI])
              r = g = b = Math.min(255, diff * 2) 
          }

          let avg = (r + g + b) / 3
          if (invert) avg = 255 - avg

          const charIndex = Math.floor((avg / 255) * (chars.length - 1))
          const char = chars[charIndex]

          if (grayscale) {
            row.push({ char })
          } else {
            row.push({ char, color: `rgb(${r},${g},${b})` })
          }
        }
        result.push(row)
      }

      setAsciiData(result)
    } catch (err) {
      console.error("Processing failed:", err)
    } finally {
      setIsProcessing(false)
    }
    }, 50) // 50ms delay gives physical device time to paint
  }, [loadedImage, width, charSet, invert, grayscale, contrast, brightness, edgeDetect])

  // Process image when parameters or image change
  useEffect(() => {
    if (loadedImage) {
      processImage()
    }
  }, [processImage, loadedImage])

  // Handle file loading
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      const img = new Image()
      img.onload = () => {
        setLoadedImage(img)
        if (isMobile) setViewMode("render") 
      }
      img.src = url
      return () => {
        URL.revokeObjectURL(url)
        setLoadedImage(null)
      }
    }
  }, [imageFile]) 

  const copyToClipboard = () => {
    const text = asciiData.map((row) => row.map((c) => c.char).join("")).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("ASCII payload copied to clipboard")
  }

  const downloadAsText = () => {
    const text = asciiData.map((row) => row.map((c) => c.char).join("")).join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pixel-2-ascii-render.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const saveToCloud = async () => {
    if (asciiData.length === 0) return
    
    setIsProcessing(true)
    const toastId = toast.loading("Syncing to cloud uplink...")

    try {
      const response = await fetch('/api/ascii', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Capture_${Date.now().toString().slice(-4)}`,
          asciiData,
          isColor: !grayscale,
          settings: {
            width: width[0],
            charSet,
            contrast: contrast[0],
            brightness: brightness[0],
            invert,
            grayscale,
            edgeDetect
          }
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("ASCII image uploaded successfully to cloud", { 
          id: toastId,
          description: "Transmission archived in the community vault.",
        })
      } else {
        throw new Error(data.error || "Uplink synchronization failed")
      }
    } catch (error: any) {
      console.error(error)
      toast.error(`Sync error: ${error.message || "Failed to push data"}`, { id: toastId })
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
                <ImageIcon className="w-5 h-5"/>
                <h2 className="font-bold text-xl">Image_Core</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 rounded-none text-white/40 hover:bg-white hover:text-black transition-colors">
                <X className="w-4 h-4"/>
            </Button>
        </div>

        <div className="space-y-8 flex-1">
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest font-mono text-muted-foreground">
                    <span>Resolution Width</span>
                    <span className="text-primary">{width[0]}px</span>
                </div>
                <Slider value={width} onValueChange={setWidth} min={40} max={300} step={1} className="py-2" />
            </div>

            <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">Character Dictionary</div>
                <Select value={charSet} onValueChange={(v: CharSetKey) => setCharSet(v)}>
                  <SelectTrigger className="bg-background/80 border-border font-mono text-sm h-10 rounded-none shadow-none focus:ring-1 focus:ring-primary/50">
                    <SelectValue placeholder="Select set" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border rounded-none">
                    <SelectItem value="standard" className="rounded-none cursor-pointer">Standard <span className="text-primary/50 ml-2">.:-=+*#%@</span></SelectItem>
                    <SelectItem value="detailed" className="rounded-none cursor-pointer">Detailed <span className="text-primary/50 ml-2">70+ chars</span></SelectItem>
                    <SelectItem value="blocks" className="rounded-none cursor-pointer">Blocks <span className="text-primary/50 ml-2">░▒▓█</span></SelectItem>
                    <SelectItem value="minimal" className="rounded-none cursor-pointer">Minimal <span className="text-primary/50 ml-2">.:</span></SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="h-px bg-border/50 w-full my-4"></div>

            <div className="space-y-5">
                <div className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-2">Display Filters</div>
                
                <div className="flex items-center justify-between group">
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => setGrayscale(!grayscale)}>Monochrome Output</span>
                  <Switch checked={grayscale} onCheckedChange={setGrayscale} className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex items-center justify-between group">
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => setInvert(!invert)}>Invert Luminosity</span>
                  <Switch checked={invert} onCheckedChange={setInvert} className="data-[state=checked]:bg-primary" />
                </div>

                <div className="flex items-center justify-between group">
                  <span className="text-sm font-mono text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => setEdgeDetect(!edgeDetect)}>Edge Detection [BETA]</span>
                  <Switch checked={edgeDetect} onCheckedChange={setEdgeDetect} className="data-[state=checked]:bg-primary" />
                </div>
            </div>

            <div className="h-px bg-border/50 w-full my-4"></div>

            <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      <span>Contrast Adjustment</span>
                      <span>{contrast[0]}%</span>
                  </div>
                  <Slider value={contrast} onValueChange={setContrast} min={-100} max={100} step={1} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs uppercase tracking-widest font-mono text-muted-foreground">
                      <span>Brightness Override</span>
                      <span>{brightness[0]}%</span>
                  </div>
                  <Slider value={brightness} onValueChange={setBrightness} min={-100} max={100} step={1} />
                </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={() => {
                setWidth([120])
                setCharSet("standard")
                setInvert(false)
                setGrayscale(false)
                setEdgeDetect(false)
                setContrast([20])
                setBrightness([0])
              }}
              className="w-full h-8 text-[9px] tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/5 border border-white/5 rounded-none mt-4 transition-all"
            >
              RESET_PARAMETERS_TO_DEFAULT
            </Button>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-white/20 mt-8 grid grid-cols-2 gap-3 relative z-10">
            <Button onClick={copyToClipboard} variant="outline" className="btn-terminal py-4 h-auto flex flex-col gap-2 rounded-none bg-black border-white/20 hover:bg-white group transition-colors">
                <Copy className="h-4 w-4 text-white group-hover:text-black" /> 
                <span className="text-[10px] tracking-widest text-white group-hover:text-black">COPY .TXT</span>
            </Button>
            <Button onClick={downloadAsText} variant="outline" className="btn-terminal py-4 h-auto flex flex-col gap-2 rounded-none bg-black border-white/20 hover:bg-white group transition-colors">
                <Download className="h-4 w-4 text-white group-hover:text-black" /> 
                <span className="text-[10px] tracking-widest text-white group-hover:text-black">DOWNLOAD</span>
            </Button>
            <Button onClick={saveToCloud} disabled={isProcessing} variant="outline" className="col-span-2 btn-terminal py-4 h-auto flex gap-3 items-center justify-center rounded-none bg-black border-white/20 hover:bg-white group transition-all">
                <CloudUpload className={`h-4 w-4 text-white group-hover:text-black ${isProcessing ? 'animate-pulse' : ''}`} /> 
                <span className="text-[10px] tracking-[0.3em] text-white group-hover:text-black">INITIALIZE_CLOUD_UPLOAD</span>
            </Button>
        </div>
      </aside>
 
      {/* Main ASCII Canvas Viewport */}
      <main className={`${isMobile && viewMode !== 'render' ? 'hidden' : 'flex'} flex-1 bg-black overflow-hidden relative flex flex-col`}>
        {/* Viewport Header */}
        <div className="h-10 bg-black border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex gap-4">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-white/40"></div>
                  <div className="w-2 h-2 bg-white/60"></div>
                  <div className="w-2 h-2 bg-white"></div>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-white/40">Viewport_1 // Render Target</div>
            </div>
            <Button size="icon" variant="ghost" onClick={processImage} disabled={isProcessing} className="h-6 w-6 rounded-none hover:bg-white text-white/40 hover:text-black group transition-colors">
                <RefreshCw className={`h-3 w-3 ${isProcessing ? "animate-spin text-white group-hover:text-black" : "group-hover:text-black"}`} />
            </Button>
        </div>
        
          {/* Terminal Text Area */}
          <div 
            className="flex-1 overflow-auto bg-black p-4 relative flex items-center justify-center custom-scrollbar"
            style={{ 
              fontSize: isMobile ? '0.22rem' : isTablet ? '0.35rem' : '0.5rem',
              lineHeight: 1
            }}
          >
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

             {asciiData.length > 0 ? (
                <div className="ascii-art cursor-default select-none border border-white/5 p-4 bg-black mx-auto">
                  {asciiData.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => (
                        <span key={x} style={{ color: cell.color }}>
                          {cell.char}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-white/50 font-mono text-sm tracking-widest min-h-[300px] gap-4">
                  {isProcessing ? (
                    "PROCESSING_MATRIX..."
                  ) : (
                    <>
                      <span>NO_DATA_AVAILABLE</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => processImage()} 
                        className="rounded-none border-white/20 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black"
                      >
                        RETRY_CORE_SCAN
                      </Button>
                    </>
                  )}
                </div>
              )}
          </div>
      </main>
    </div>
  )
}
