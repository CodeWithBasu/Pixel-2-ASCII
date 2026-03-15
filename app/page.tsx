"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoToAsciiConverter } from "@/components/video-to-ascii-converter"
import { ImageToAsciiConverter } from "@/components/image-to-ascii-converter"
import { TerminalHeader } from "@/components/terminal-header"
import { TerminalFrame } from "@/components/terminal-frame"
import { Upload, Video, Image as ImageIcon, FileVideo } from "lucide-react"

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("video")
  
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
    }
  }, [])

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent, type: "video" | "image") => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (type === "video" && file && file.type.startsWith("video/")) {
      setVideoFile(file)
    } else if (type === "image" && file && file.type.startsWith("image/")) {
      setImageFile(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <TerminalHeader />

      <main className="container mx-auto px-4 py-4 md:px-6 md:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-mono tracking-tighter text-foreground font-bold">
                PIXEL-2-ASCII <span className="text-primary text-sm align-top">V1.0</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-mono max-w-xl">
                Advanced conversion engine for transforming digital media into high-fidelity terminal art.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-muted/50 border border-border p-1 w-full md:w-auto">
                <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-xs uppercase tracking-widest px-6">
                  <Video className="w-3 h-3 mr-2" /> Video
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-xs uppercase tracking-widest px-6">
                  <ImageIcon className="w-3 h-3 mr-2" /> Image
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsContent value="video" className="mt-0 space-y-6">
              {!videoFile ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <Card
                    className="group border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer bg-card/30 relative overflow-hidden"
                    onDrop={(e) => handleDrop(e, "video")}
                    onDragOver={handleDragOver}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="p-12 md:p-20 text-center space-y-6 relative z-10">
                      <div className="w-16 h-16 mx-auto border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors bg-background">
                        <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-mono text-foreground font-bold">Inject Video Stream</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                          Drag and drop source or click to browse.
                          <br />
                          <span className="text-[10px] opacity-50 uppercase tracking-tighter mt-2 inline-block">
                            MP4 / WebM / MOV / AVI
                          </span>
                        </p>
                      </div>

                      <Button className="btn-terminal" variant="outline">
                        Select Source
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
                  </Card>

                  <Card className="border-border bg-card/30 p-1">
                    <TerminalFrame title="LIVE_PREVIEW.SYS">
                      <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                        <video
                          className="w-full h-full object-cover opacity-60"
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{ imageRendering: "pixelated" }}
                        >
                          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RPReplay_Final1758943384-lFlOhPjiu0rgv5mbWLixF6xIQk8pUX.mov" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
                          <div className="text-center space-y-2">
                            <div className="text-[10px] text-primary font-mono uppercase tracking-[0.3em] animate-pulse">Running Sample</div>
                            <div className="h-px w-12 bg-primary/50 mx-auto"></div>
                          </div>
                        </div>
                      </div>
                    </TerminalFrame>
                  </Card>
                </div>
              ) : (
                <VideoToAsciiConverter videoFile={videoFile} onReset={() => setVideoFile(null)} />
              )}
            </TabsContent>

            <TabsContent value="image" className="mt-0 space-y-6">
              {!imageFile ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <Card
                    className="group border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer bg-card/30 relative overflow-hidden"
                    onDrop={(e) => handleDrop(e, "image")}
                    onDragOver={handleDragOver}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <div className="p-12 md:p-20 text-center space-y-6 relative z-10">
                      <div className="w-16 h-16 mx-auto border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors bg-background">
                        <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-mono text-foreground font-bold">Inject Static Frame</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                          Upload image for conversion.
                          <br />
                          <span className="text-[10px] opacity-50 uppercase tracking-tighter mt-2 inline-block">
                            PNG / JPG / WEBP / SVG
                          </span>
                        </p>
                      </div>

                      <Button className="btn-terminal" variant="outline">
                        Select Frame
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  </Card>

                  <Card className="border-border bg-card/30 flex flex-col items-center justify-center p-12 space-y-6 text-center h-full">
                    <div className="p-4 border border-border relative">
                      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                      <div className="text-4xl font-mono text-primary/20 opacity-50">IMAGE_MODULE</div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest max-w-[200px]">
                      Static frame processing enabled. supports color mapping and character set selection.
                    </p>
                  </Card>
                </div>
              ) : (
                <ImageToAsciiConverter imageFile={imageFile} onReset={() => setImageFile(null)} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
