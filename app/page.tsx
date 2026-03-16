"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { VideoToAsciiConverter } from "@/components/video-to-ascii-converter"
import { ImageToAsciiConverter } from "@/components/image-to-ascii-converter"
import { TerminalHeader } from "@/components/terminal-header"
import { Meteors } from "@/components/meteors"
import { Upload, Video, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [activeMode, setActiveMode] = useState<"video" | "image">("image")
  
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setActiveMode("video")
      setImageFile(null)
    }
  }, [])

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      setActiveMode("image")
      setVideoFile(null)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file)
        setActiveMode("video")
        setImageFile(null)
      } else if (file.type.startsWith("image/")) {
        setImageFile(file)
        setActiveMode("image")
        setVideoFile(null)
      }
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const resetAll = () => {
    setVideoFile(null)
    setImageFile(null)
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground font-mono flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         <Meteors number={30} />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,255,128,0.03)_0%,transparent_100%)] z-0"></div>
      
      <TerminalHeader />

      <main className="flex-1 overflow-hidden flex flex-col z-10 p-4">
        <AnimatePresence mode="wait">
          {(!videoFile && !imageFile) ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-1 flex flex-col items-center justify-center space-y-8 h-full"
            >
               <div className="text-center space-y-4 max-w-2xl relative">
                  <div className="absolute -left-8 -top-8 w-16 h-16 border-t-2 border-l-2 border-primary/20"></div>
                  <div className="absolute -right-8 -bottom-8 w-16 h-16 border-b-2 border-r-2 border-primary/20"></div>
                  
                  <h1 className="text-4xl md:text-6xl font-mono tracking-tighter text-foreground font-bold drop-shadow-[0_0_15px_rgba(0,255,128,0.3)]">
                    PIXEL-2-ASCII <span className="text-primary text-sm align-top">SYS_V2.0</span>
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground font-mono">
                    Advanced conversion engine. Drop digital media to initialize processing matrix.
                  </p>
               </div>

               <div 
                  className="w-full max-w-3xl border border-primary/30 bg-card/10 backdrop-blur-md relative group cursor-pointer overflow-hidden rounded-sm"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
               >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Scanline decoration */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-size-[100%_4px] pointer-events-none opacity-20"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-primary/20 relative z-10">
                    <div 
                      className="p-12 md:p-16 text-center space-y-6 hover:bg-primary/10 transition-colors duration-300"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageIcon className="w-10 h-10 mx-auto text-primary animate-pulse" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-mono text-foreground font-bold uppercase tracking-widest">Image Frame</h3>
                        <p className="text-xs text-muted-foreground">PNG / JPG / WEBP</p>
                      </div>
                    </div>
                    
                    <div 
                      className="p-12 md:p-16 text-center space-y-6 hover:bg-primary/10 transition-colors duration-300"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <Video className="w-10 h-10 mx-auto text-primary animate-pulse" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-mono text-foreground font-bold uppercase tracking-widest">Video Stream</h3>
                        <p className="text-xs text-muted-foreground">MP4 / WEBM</p>
                      </div>
                    </div>
                  </div>
               </div>

               <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
               <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
               
               <div className="flex gap-4 opacity-50 text-xs uppercase tracking-widest pt-8">
                  <span className="flex items-center"><div className="w-2 h-2 bg-primary mr-2"></div> Ready</span>
                  <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 mr-2"></div> Auto-Detect</span>
               </div>
            </motion.div>
          ) : (
             <motion.div 
               key="editor"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full flex flex-col overflow-hidden border border-border bg-card/20 rounded-sm"
             >
                {/* Embedded Converter with unified wrapper or passing mode */}
                {activeMode === "image" && imageFile && (
                  <ImageToAsciiConverter imageFile={imageFile} onReset={resetAll} />
                )}
                {activeMode === "video" && videoFile && (
                  <VideoToAsciiConverter videoFile={videoFile} onReset={resetAll} />
                )}
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
