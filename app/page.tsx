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
               <div className="text-center space-y-4 max-w-2xl relative z-10">
                  <div className="absolute -left-12 -top-12 w-24 h-24 border-t-2 border-l-2 border-[#00FFAA]/40 rounded-tl-3xl opacity-50 shadow-[0_0_15px_rgba(0,255,170,0.2)]"></div>
                  <div className="absolute -right-12 -bottom-12 w-24 h-24 border-b-2 border-r-2 border-[#00FFAA]/40 rounded-br-3xl opacity-50 shadow-[0_0_15px_rgba(0,255,170,0.2)]"></div>
                  
                  <h1 className="text-5xl md:text-7xl font-mono tracking-tighter font-extrabold bg-clip-text text-transparent bg-linear-to-br from-white via-[#00FFAA] to-[#005533] drop-shadow-[0_0_35px_rgba(0,255,170,0.3)] pb-2">
                    PIXEL-2-ASCII <span className="text-[#00FFAA] text-xl align-top font-bold drop-shadow-none">SYS_V2.0</span>
                  </h1>
                  <p className="text-sm md:text-base text-zinc-400 font-mono tracking-wide max-w-lg mx-auto">
                    Advanced conversion engine. Drop digital media into the <span className="text-[#00FFAA]">matrix</span> to initialize processing.
                  </p>
               </div>

               <div 
                  className="w-full max-w-4xl border border-[#00FFAA]/20 bg-black/40 backdrop-blur-xl relative group cursor-pointer overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-[#00FFAA]/50 hover:shadow-[0_0_80px_rgba(0,255,170,0.15)]"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
               >
                  <div className="absolute inset-0 bg-linear-to-b from-[#00FFAA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#00FFAA]/20 relative z-10">
                    <div 
                      className="p-16 md:p-20 text-center space-y-8 hover:bg-[#00FFAA]/5 hover:shadow-[inset_0_0_50px_rgba(0,255,170,0.05)] transition-all duration-500 flex flex-col items-center justify-center group/btn"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className="p-4 rounded-full bg-[#00FFAA]/10 border border-[#00FFAA]/20 group-hover/btn:scale-110 group-hover/btn:border-[#00FFAA]/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,170,0.1)] group-hover/btn:shadow-[0_0_25px_rgba(0,255,170,0.3)]">
                         <ImageIcon className="w-12 h-12 text-[#00FFAA]" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-mono text-white font-bold uppercase tracking-[0.2em] group-hover/btn:text-[#00FFAA] transition-colors">Image Matrix</h3>
                        <p className="text-xs text-zinc-500 font-sans tracking-widest">PNG / JPG / WEBP</p>
                      </div>
                    </div>
                    
                    <div 
                      className="p-16 md:p-20 text-center space-y-8 hover:bg-[#00FFAA]/5 hover:shadow-[inset_0_0_50px_rgba(0,255,170,0.05)] transition-all duration-500 flex flex-col items-center justify-center group/btn"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <div className="p-4 rounded-full bg-[#00FFAA]/10 border border-[#00FFAA]/20 group-hover/btn:scale-110 group-hover/btn:border-[#00FFAA]/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,170,0.1)] group-hover/btn:shadow-[0_0_25px_rgba(0,255,170,0.3)]">
                         <Video className="w-12 h-12 text-[#00FFAA]" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-mono text-white font-bold uppercase tracking-[0.2em] group-hover/btn:text-[#00FFAA] transition-colors">Video Stream</h3>
                        <p className="text-xs text-zinc-500 font-sans tracking-widest">MP4 / WEBM</p>
                      </div>
                    </div>
                  </div>
               </div>

               <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
               <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
               
               <div className="flex gap-6 opacity-70 text-xs uppercase tracking-widest pt-12 relative z-10">
                  <span className="flex items-center text-zinc-300"><div className="w-2 h-2 rounded-full bg-blue-500 mr-3 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> System Optimized</span>
                  <span className="flex items-center text-zinc-300"><div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse mr-3 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div> Awaiting Input</span>
               </div>
            </motion.div>
          ) : (
             <motion.div 
               key="editor"
               initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               transition={{ duration: 0.5, ease: "easeOut" }}
               className="h-full flex flex-col overflow-hidden border border-[#00FFAA]/20 bg-black/60 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
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
