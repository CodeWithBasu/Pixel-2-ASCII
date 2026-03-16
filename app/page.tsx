"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { VideoToAsciiConverter } from "@/components/video-to-ascii-converter"
import { ImageToAsciiConverter } from "@/components/image-to-ascii-converter"
import { TerminalHeader } from "@/components/terminal-header"
import { Meteors } from "@/components/meteors"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Twitter, Linkedin, Heart, Coffee } from "lucide-react"
import { useEffect } from "react"

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [activeMode, setActiveMode] = useState<"video" | "image">("image")
  
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const isTall = useMediaQuery("(min-height: 800px)")
  
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
    if (videoInputRef.current) videoInputRef.current.value = ""
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
         <Meteors number={35} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full w-full overflow-y-auto md:overflow-hidden lg:max-w-7xl lg:mx-auto">
        <TerminalHeader />

        <main className="flex-1 flex flex-col p-4 md:p-12 lg:p-16 min-h-0">
        <AnimatePresence mode="wait">
          {(!videoFile && !imageFile) ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-between w-full max-w-6xl mx-auto py-8 px-4"
            >
               <div className="text-center space-y-3 w-full mix-blend-difference mb-8">
                  <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-2">
                    Ascii<br />Generator
                  </h1>
                  <p className="text-[10px] sm:text-xs md:text-base text-zinc-500 font-mono tracking-[0.3em] uppercase max-w-xs sm:max-w-md mx-auto opacity-60">
                    Select a media format to begin.
                  </p>
               </div>

                <div 
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
               >
                  <div 
                    className="p-6 md:p-8 border border-white/10 bg-black hover:border-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex flex-col justify-between aspect-video group"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">01 // Format</div>
                    <div>
                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">Image</h3>
                      <p className="text-[10px] font-mono text-zinc-600 group-hover:text-black transition-colors">PNG . JPG . WEBP</p>
                    </div>
                  </div>
                  
                  <div 
                    className="p-6 md:p-8 border border-white/10 bg-black hover:border-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex flex-col justify-between aspect-video group"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">02 // Format</div>
                    <div>
                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">Video</h3>
                      <p className="text-[10px] font-mono text-zinc-600 group-hover:text-black transition-colors">MP4 . WEBM</p>
                    </div>
                  </div>
               </div>

               <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
               <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
               
               <div className="w-full flex flex-col md:flex-row justify-between items-center border-t border-white/5 py-8 gap-6 mt-12 mb-4">
                 <div className="flex flex-col items-center md:items-start gap-1">
                   {/* ... credit content ... */}
                   <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-600">Build // 2.0.4</div>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
                     Made with <Heart className="w-3 h-3 text-white/30 fill-white/10" /> & <Coffee className="w-3 h-3 text-white/30" /> by <span className="text-white/70 font-bold">Basudev</span>
                   </div>
                 </div>

                 <div className="flex items-center gap-8">
                   <a href="https://github.com/CodeWithBasu" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors duration-300">
                     <Github className="w-4 h-4" />
                   </a>
                   <a href="#" className="text-zinc-600 hover:text-white transition-colors duration-300">
                     <Twitter className="w-4 h-4" />
                   </a>
                   <a href="#" className="text-zinc-600 hover:text-white transition-colors duration-300">
                     <Linkedin className="w-4 h-4" />
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
