"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { VideoToAsciiConverter } from "@/components/video-to-ascii-converter"
import { ImageToAsciiConverter } from "@/components/image-to-ascii-converter"
import { TerminalHeader } from "@/components/terminal-header"
import GlassSurface from "@/components/GlassSurface"
import Lightfall from "@/components/Lightfall"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Twitter, Linkedin, Heart, Coffee } from "lucide-react"
import { useResponsive } from "@/hooks/use-responsive"
import DynamicTextSlider from "@/components/ui/dynamic-text-slider"
import AnimatedGlowingBorder from "@/components/ui/animated-glowing-border"

export default function HomePage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [activeMode, setActiveMode] = useState<"video" | "image">("image")
  const [showSplash, setShowSplash] = useState(true)
  
  const { isMobile, isTablet, isShortScreen } = useResponsive()
  
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

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
    <div className="h-[100dvh] w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col relative">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            className="fixed inset-0 z-100 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-8"
            >
              <img src="/app-icon.png" alt="ASCII_CORE" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
              
              <div className="flex flex-col items-center gap-4">
                 <div className="text-white/60 tracking-[0.6em] font-mono text-[10px] uppercase">
                    INITIALIZING_CORE //
                 </div>
                 <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "circInOut" }}
                    />
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 opacity-80">
        <Lightfall colors={['#A6C8FF', '#5227FF', '#FF9FFC']} backgroundColor="#0A29FF" speed={1} streakCount={3} streakWidth={1} streakLength={1} glow={1} density={0.4} twinkle={1} zoom={2} backgroundGlow={1} opacity={1} mouseInteraction={true} mouseStrength={1} mouseRadius={0.6} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full w-full overflow-y-auto md:overflow-hidden lg:max-w-7xl lg:mx-auto">
        <TerminalHeader />

        <main className={`flex-1 flex flex-col min-h-0 transition-all duration-500 ${isShortScreen ? 'p-2 md:p-4 lg:p-6' : 'p-4 md:p-12 lg:p-16'}`}>
        <AnimatePresence mode="wait">
          {(!videoFile && !imageFile) ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex-1 flex flex-col items-center justify-between w-full max-w-6xl mx-auto px-4 transition-all duration-500 ${isShortScreen ? 'py-2' : 'py-8'}`}
            >
               <div className={`text-center w-full mix-blend-difference transition-all duration-500 ${isShortScreen ? 'space-y-1 mb-4' : 'space-y-3 mb-8'}`}>
                  <DynamicTextSlider />
                  <p className="text-[10px] sm:text-xs md:text-base text-zinc-500 font-mono tracking-[0.3em] uppercase max-w-xs sm:max-w-md mx-auto opacity-60">
                    Select a media format to begin.
                  </p>
               </div>

                <div 
                  className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
               >
                  <AnimatedGlowingBorder>
                    <GlassSurface 
                      backgroundOpacity={0.1}
                      className="cursor-pointer group w-full h-full"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <div className={`border border-white/10 hover:border-white hover:bg-white hover:text-black transition-colors duration-300 flex flex-col justify-between h-full w-full ${isShortScreen ? 'p-4 md:p-6 h-32 md:h-40' : 'p-6 md:p-8 h-48 md:h-56'}`}>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">01 // Format</div>
                        <div>
                          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">Image</h3>
                          <p className="text-[10px] font-mono text-zinc-600 group-hover:text-black transition-colors">PNG . JPG . WEBP</p>
                        </div>
                      </div>
                    </GlassSurface>
                  </AnimatedGlowingBorder>

                  <AnimatedGlowingBorder>
                    <GlassSurface 
                      backgroundOpacity={0.1}
                      className="cursor-pointer group w-full h-full"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <div className={`border border-white/10 hover:border-white hover:bg-white hover:text-black transition-colors duration-300 flex flex-col justify-between h-full w-full ${isShortScreen ? 'p-4 md:p-6 h-32 md:h-40' : 'p-6 md:p-8 h-48 md:h-56'}`}>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">02 // Format</div>
                        <div>
                          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter uppercase mb-2">Video</h3>
                          <p className="text-[10px] font-mono text-zinc-600 group-hover:text-black transition-colors">MP4 . WEBM</p>
                        </div>
                      </div>
                    </GlassSurface>
                  </AnimatedGlowingBorder>
               </div>
               
               <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
               <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
               
               <div className={`w-full flex flex-col md:flex-row justify-between items-center border-t border-white/5 transition-all duration-500 ${isShortScreen ? 'py-4 gap-4 mt-6 mb-2' : 'py-8 gap-6 mt-12 mb-4'}`}>
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
