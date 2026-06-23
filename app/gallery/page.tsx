"use client"

import { useState, useEffect } from "react"
import { TerminalHeader } from "@/components/terminal-header"
import Lightfall from "@/components/Lightfall"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface GalleryItem {
  _id: string
  title: string
  asciiText: string
  isColor: boolean
  createdAt: string
  author?: string
  settings: any
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ascii")
      const data = await res.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="min-h-screen w-screen bg-black text-white font-sans flex flex-col relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]"></div>
        <Lightfall colors={['#A6C8FF', '#5227FF', '#FF9FFC']} backgroundColor="#0A29FF" speed={1} streakCount={8} streakWidth={1} streakLength={1} glow={1} density={1} twinkle={1} zoom={2} backgroundGlow={1} opacity={1} mouseInteraction={true} mouseStrength={1} mouseRadius={0.6} />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full lg:max-w-7xl lg:mx-auto">
        <TerminalHeader />

        <main className="flex-1 p-4 md:p-12 lg:p-16">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors text-xs font-mono uppercase tracking-[0.3em] mb-6 group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Return_To_Command_Center
              </Link>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                Vault<br /><span className="text-zinc-800">Gallery</span>
              </h1>
            </div>
            <button 
              onClick={fetchItems} 
              disabled={loading}
              className="p-6 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center group"
            >
              <RefreshCw className={`w-6 h-6 text-zinc-500 group-hover:text-white ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
            </button>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4 font-mono text-zinc-700 tracking-[0.5em] uppercase">
              <RefreshCw className="w-8 h-8 animate-spin mb-4 opacity-20" />
              Syncing_Cloud_Nodes...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {items.map((item, idx) => {
                  let parsedAscii = []
                  try {
                    parsedAscii = JSON.parse(item.asciiText)
                  } catch (e) {
                      console.error("Failed to parse ascii", e)
                  }

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedItem(item)}
                      className="group border border-white/5 bg-zinc-900/20 hover:border-white/40 hover:bg-zinc-900/40 transition-all p-5 flex flex-col aspect-4/5 overflow-hidden relative cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-6 z-10 relative">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Index_{item._id.slice(-6)}</span>
                          <h3 className="text-xl font-bold tracking-tighter uppercase leading-tight group-hover:text-white transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <div className="w-2 h-2 bg-zinc-800 group-hover:bg-primary transition-colors"></div>
                      </div>

                      <div className="flex-1 overflow-hidden bg-black border border-white/5 flex items-center justify-center p-4 relative group-hover:border-white/20 transition-all">
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[15px_15px] pointer-events-none"></div>
                         
                         <div className="font-[Monaco,Consolas,monospace] text-[1.5px] leading-none tracking-tight whitespace-pre scale-[4] group-hover:scale-[4.5] transition-transform duration-700">
                            {parsedAscii.slice(0, 50).map((row: any, y: number) => (
                              <div key={y} className="flex">
                                {row.slice(0, 60).map((cell: any, x: number) => (
                                  <span key={x} style={{ color: cell.color || '#444' }}>
                                    {cell.char}
                                  </span>
                                ))}
                              </div>
                            ))}
                         </div>

                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-[10px] font-mono tracking-[0.5em] text-white uppercase border border-white/20 px-4 py-2">View_Full_Matrix</span>
                         </div>
                      </div>

                      <div className="mt-6 flex justify-between items-center z-10 relative">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-tighter">
                           Author // {item.author || 'Anonymous'}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {items.length === 0 && !loading && (
            <div className="h-96 flex flex-col items-center justify-center space-y-6 border border-dashed border-white/5 opacity-50">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center rotate-45 mb-4">
                  <ArrowLeft className="w-4 h-4 -rotate-45 opacity-40" />
                </div>
                <span className="font-mono text-xs tracking-[0.5em] uppercase text-zinc-500">Cloud_Link_Inactive</span>
                <Link href="/" className="px-6 py-3 border border-white/10 text-[10px] font-mono hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em]">
                   Return_To_System_Core
                </Link>
            </div>
          )}
        </main>
      </div>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12 backdrop-blur-xl bg-black/90"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full h-full max-w-6xl bg-zinc-950 border border-white/10 flex flex-col relative shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-12 border-b border-white/10 flex items-center justify-between px-6 bg-black shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-500/50"></div>
                    <div className="w-2 h-2 bg-yellow-500/50"></div>
                    <div className="w-2 h-2 bg-green-500/50"></div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Manifest // {selectedItem.title}</span>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-12 custom-scrollbar bg-black flex items-center justify-center">
                <div className="font-[Monaco,Consolas,monospace] text-[4px] md:text-[6px] leading-none tracking-tight whitespace-pre mx-auto w-max py-12">
                   {(() => {
                      try {
                        const data = JSON.parse(selectedItem.asciiText)
                        return data.map((row: any, y: number) => (
                          <div key={y} className="flex">
                            {row.map((cell: any, x: number) => (
                              <span key={x} style={{ color: cell.color || '#fff' }}>
                                {cell.char}
                              </span>
                            ))}
                          </div>
                        ))
                      } catch (e) {
                        return "Failed to load matrix data"
                      }
                   })()}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-zinc-950 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                 <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest">{selectedItem.title}</span>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase italic">Recorded on node {selectedItem._id}</span>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const text = JSON.parse(selectedItem.asciiText).map((row: any) => row.map((c: any) => c.char).join("")).join("\n")
                        navigator.clipboard.writeText(text)
                        toast.success("ASCII grid copied to localized buffer")
                      }}
                      className="px-6 py-2 border border-white/5 text-[10px] font-mono hover:bg-white hover:text-black transition-all uppercase tracking-widest"
                    >
                      Sync_To_Clipboard
                    </button>
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-2 bg-white text-black text-[10px] font-mono font-bold hover:bg-zinc-200 transition-all uppercase tracking-widest"
                    >
                      Exit_Terminal
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

