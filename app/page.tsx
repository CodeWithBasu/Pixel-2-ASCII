"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { VideoToAsciiConverter } from "@/components/video-to-ascii-converter"
import { ImageToAsciiConverter } from "@/components/image-to-ascii-converter"
import { TerminalHeader } from "@/components/terminal-header"
import { Meteors } from "@/components/meteors"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Twitter, Linkedin, Heart, Coffee } from "lucide-react"

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
    <div className="h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
         <Meteors number={35} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full transform scale-[0.85] origin-center">
        <TerminalHeader />

        <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-8">
        <AnimatePresence mode="wait">
          {(!videoFile && !imageFile) ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center space-y-16 h-full w-full max-w-6xl mx-auto"
            >
               <div className="text-center space-y-6 w-full mix-blend-difference mt-auto">
                  <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                    Ascii<br />Generator
                  </h1>
                  <p className="text-sm md:text-base text-zinc-400 font-mono tracking-widest uppercase max-w-md mx-auto">
                    Select a media format to begin.
                  </p>
               </div>

               <div 
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto mb-16"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
               >
                  <div 
                    className="p-10 border border-white/20 bg-black hover:border-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex flex-col justify-between aspect-2/1 group"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 group-hover:text-black transition-colors">01 // Format</div>
                    <div>
                      <h3 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase mb-2">Image</h3>
                      <p className="text-sm font-mono text-zinc-500 group-hover:text-black transition-colors">PNG . JPG . WEBP</p>
                    </div>
                  </div>
                  
                  <div 
                    className="p-10 border border-white/20 bg-black hover:border-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex flex-col justify-between aspect-2/1 group"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 group-hover:text-black transition-colors">02 // Format</div>
                    <div>
                      <h3 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase mb-2">Video</h3>
                      <p className="text-sm font-mono text-zinc-500 group-hover:text-black transition-colors">MP4 . WEBM</p>
                    </div>
                  </div>
               </div>

               <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
               <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
               
               <div className="w-full flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 gap-6">
                 <div className="flex flex-col items-center md:items-start gap-2">
                   <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                     Build // 2.0.4
                   </div>
                   <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                     Made with <Heart className="w-3 h-3 text-white fill-white" /> and <Coffee className="w-3 h-3 text-white" /> by <span className="text-white font-bold select-none cursor-default">Basudev</span>
                   </div>
                 </div>

                 <div className="flex items-center gap-6">
                   <a href="https://github.com/CodeWithBasu" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors duration-200">
                     <Github className="w-5 h-5" />
                   </a>
                   <a href="#" className="text-zinc-500 hover:text-white transition-colors duration-200">
                     <Twitter className="w-5 h-5" />
                   </a>
                   <a href="#" className="text-zinc-500 hover:text-white transition-colors duration-200">
                     <Linkedin className="w-5 h-5" />
                   </a>
                 </div>
               </div>
            </motion.div>
          ) : (
             <motion.div 
               key="editor"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               className="h-full flex flex-col overflow-hidden border border-white/20 bg-black"
             >
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
    </div>
  )
}
