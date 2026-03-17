"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function TerminalHeader() {
  const [currentTime, setCurrentTime] = useState("")
  const pathname = usePathname()

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
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="flex items-center justify-between">
          <div className="text-white font-black tracking-tighter text-3xl uppercase">
            Ascii_Studio
          </div>

          <div className="flex items-center space-x-12">
            <nav className="hidden md:flex items-center space-x-8 mr-12 border-l border-white/5 pl-8">
              <Link href="/" className={`text-[10px] font-mono tracking-[0.3em] uppercase transition-colors ${pathname === '/' ? 'text-white underline' : 'text-zinc-600 hover:text-white'}`}>
                Engine
              </Link>
              <Link href="/gallery" className={`text-[10px] font-mono tracking-[0.3em] uppercase transition-colors ${pathname === '/gallery' ? 'text-white underline' : 'text-zinc-600 hover:text-white'}`}>
                Gallery
              </Link>
            </nav>
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
