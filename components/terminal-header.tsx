"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, User, ShieldCheck } from "lucide-react"

export function TerminalHeader() {
  const [currentTime, setCurrentTime] = useState("")
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

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

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
        }
      } catch (e) {
        setUser(null)
      }
    }

    updateTime()
    checkAuth()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-white/10 bg-black relative z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-4 text-white font-black tracking-tighter text-3xl uppercase hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 overflow-hidden border border-white/20">
              <Image 
                src="/hero.png" 
                alt="Logo" 
                fill 
                className="object-cover"
              />
            </div>
            <span>Ascii_Studio</span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <nav className="flex items-center space-x-6 md:space-x-8 md:border-l border-white/5 md:pl-8">
              <Link href="/" className={`text-[10px] font-mono tracking-[0.3em] uppercase transition-colors ${pathname === '/' ? 'text-white font-bold' : 'text-zinc-600 hover:text-white'}`}>
                Engine
              </Link>
              <Link href="/gallery" className={`text-[10px] font-mono tracking-[0.3em] uppercase transition-colors ${pathname === '/gallery' ? 'text-white font-bold' : 'text-zinc-600 hover:text-white'}`}>
                Gallery
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className={`text-[10px] font-mono tracking-[0.3em] uppercase transition-colors text-red-500 hover:text-red-400 ${pathname === '/admin' ? 'underline' : ''}`}>
                  [Admin]
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-8 ml-auto">
                <div className="flex items-center gap-4 border-l border-white/5 pl-8">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] text-white/20 font-mono tracking-[0.3em] uppercase">User</span>
                                <span className="text-[10px] text-white font-mono uppercase truncate max-w-[100px]">{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="text-zinc-600 hover:text-white transition-colors">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-600 hover:text-white transition-colors flex items-center gap-2">
                           <User className="w-3 h-3" /> Login
                        </Link>
                    )}
                </div>

                <div className="hidden lg:flex flex-col items-end border-l border-white/5 pl-8">
                    <span className="text-[10px] text-white/20 font-mono tracking-[0.3em] uppercase mb-1">Clock</span>
                    <span className="text-xs text-white font-mono tracking-wider">{currentTime || "00:00:00"}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
