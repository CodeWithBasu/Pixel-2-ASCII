"use client"

import { useState, useEffect } from "react"

export function TerminalHeader() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl relative z-50">
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#00FFAA]/50 to-transparent"></div>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 select-none">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00FFAA]/10 border border-[#00FFAA]/30 text-[#00FFAA] shadow-[0_0_10px_rgba(0,255,170,0.2)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-mono text-lg font-bold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">ASC-II // ENGINE</span>
              <span className="text-[10px] text-[#00FFAA] font-mono tracking-widest uppercase opacity-80">v2.0.4 Online</span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">System Clock</span>
               <span className="text-sm text-zinc-300 font-mono tracking-wider">{currentTime || "00:00:00"}</span>
            </div>
            <div className="flex items-center space-x-3 bg-[#00FFAA]/5 px-4 py-2 rounded-full border border-[#00FFAA]/20">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFAA] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFAA] shadow-[0_0_8px_rgba(0,255,170,1)]"></span>
              </div>
              <span className="text-[#00FFAA] text-xs font-mono font-bold tracking-widest uppercase">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
