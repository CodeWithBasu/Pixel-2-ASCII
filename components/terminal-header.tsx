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
    <header className="border-b border-white/10 bg-black relative z-50">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="text-white font-black tracking-tighter text-3xl uppercase">
            Ascii_Studio
          </div>

          <div className="flex items-center space-x-12">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] text-white/20 font-mono tracking-[0.3em] uppercase mb-1">Status</span>
               <span className="text-xs text-white font-mono tracking-widest uppercase">System Online</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-white/20 font-mono tracking-[0.3em] uppercase mb-1">Clock</span>
               <span className="text-xs text-white font-mono tracking-wider">{currentTime || "00:00:00"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
