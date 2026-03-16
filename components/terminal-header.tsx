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
    <header className="border-b border-white/20 bg-black relative z-50">
      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold tracking-tighter text-2xl uppercase">
            Ascii_Studio
          </div>

          <div className="flex items-center space-x-12">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Local Time</span>
               <span className="text-xs text-white font-mono tracking-wider">{currentTime || "00:00:00"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white"></div>
              <span className="text-white text-xs font-mono font-bold tracking-widest uppercase">Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
