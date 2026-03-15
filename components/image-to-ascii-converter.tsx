"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, Share2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

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
  const [asciiData, setAsciiData] = useState<{ char: string; color?: string }[][]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [width, setWidth] = useState([100])
  const [charSet, setCharSet] = useState<CharSetKey>("standard")
  const [invert, setInvert] = useState(false)
  const [grayscale, setGrayscale] = useState(false)
  const [contrast, setContrast] = useState([0])
  const [brightness, setBrightness] = useState([0])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const processImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return

    setIsProcessing(true)
    const img = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })

    if (!ctx) return

    const aspect = img.height / img.width
    const targetWidth = width[0]
    const targetHeight = Math.floor(targetWidth * aspect * 0.55) // 0.55 to compensate for font aspect ratio

    canvas.width = targetWidth
    canvas.height = targetHeight

    // Apply brightness and contrast filters
    ctx.filter = `brightness(${100 + brightness[0]}%) contrast(${100 + contrast[0]}%)`
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

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
    setIsProcessing(false)
  }, [width, charSet, invert, grayscale, contrast, brightness])

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      const img = new Image()
      img.onload = () => {
        imageRef.current = img
        processImage()
      }
      img.src = url
      return () => URL.revokeObjectURL(url)
    }
  }, [imageFile, processImage])

  const copyToClipboard = () => {
    const text = asciiData.map((row) => row.map((c) => c.char).join("")).join("\n")
    navigator.clipboard.writeText(text)
    toast.success("ASCII art copied to clipboard!")
  }

  const downloadAsText = () => {
    const text = asciiData.map((row) => row.map((c) => c.char).join("")).join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ascii-art.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-border bg-card lg:col-span-1">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-mono tracking-wide text-foreground">Controls</h2>
              <Button size="icon" variant="ghost" onClick={processImage} disabled={isProcessing}>
                <RefreshCw className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Character Set</Label>
                <Select value={charSet} onValueChange={(v: CharSetKey) => setCharSet(v)}>
                  <SelectTrigger className="bg-background border-border font-mono">
                    <SelectValue placeholder="Select set" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="blocks">Blocks</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Width: {width[0]}px</Label>
                </div>
                <Slider value={width} onValueChange={setWidth} min={40} max={200} step={1} className="py-4" />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="invert" className="text-sm font-mono">Invert Colors</Label>
                  <Switch id="invert" checked={invert} onCheckedChange={setInvert} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="grayscale" className="text-sm font-mono">Grayscale Mode</Label>
                  <Switch id="grayscale" checked={grayscale} onCheckedChange={setGrayscale} />
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-border mt-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Brightness: {brightness[0]}%</Label>
                  <Slider value={brightness} onValueChange={setBrightness} min={-100} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Contrast: {contrast[0]}%</Label>
                  <Slider value={contrast} onValueChange={setContrast} min={-100} max={100} step={1} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
              <Button onClick={copyToClipboard} variant="outline" className="btn-terminal py-2 px-3 h-auto text-xs">
                <Copy className="h-3 w-3 mr-2" /> Copy
              </Button>
              <Button onClick={downloadAsText} variant="outline" className="btn-terminal py-2 px-3 h-auto text-xs">
                <Download className="h-3 w-3 mr-2" /> .TXT
              </Button>
              <Button onClick={onReset} variant="outline" className="btn-terminal py-2 px-3 h-auto text-xs col-span-2">
                New Image
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card lg:col-span-2 overflow-hidden">
          <div className="p-0 flex flex-col h-full bg-background/50">
            <div className="border-b border-border p-4 flex items-center justify-between bg-card">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                ASCII Generation Result
              </span>
              <div className="flex space-x-1">
                <div className="w-2h-2 rounded-full bg-destructive/50 w-2 h-2"></div>
                <div className="w-2h-2 rounded-full bg-yellow-500/50 w-2 h-2"></div>
                <div className="w-2h-2 rounded-full bg-primary/50 w-2 h-2"></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 terminal-grid min-h-[400px]">
              {asciiData.length > 0 ? (
                <div className="ascii-art leading-[0.8] tracking-tighter mx-auto min-w-max">
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
                <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                  {isProcessing ? "Processing..." : "Waiting for image..."}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
