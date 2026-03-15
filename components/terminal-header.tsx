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
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-foreground font-mono text-lg tracking-wide">Video ASCII Converter</div>
            <div className="text-xs text-muted-foreground font-mono tracking-wider uppercase">System Online</div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-xs text-muted-foreground font-mono tracking-wider">{currentTime}</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary animate-pulse"></div>
              <span className="text-primary text-xs font-mono tracking-wider">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
