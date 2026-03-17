"use client"

import { useState, useEffect } from "react"
import { TerminalHeader } from "@/components/terminal-header"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Shield, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface GalleryItem {
  _id: string
  title: string
  createdAt: string
  author?: string
}

export default function AdminDashboard() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ascii")
      const data = await res.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (error) {
      toast.error("Failed to sync vault logs.")
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to purge this transmission? This action is irreversible.")) return

    try {
      const res = await fetch(`/api/admin/ascii/${id}`, { method: "DELETE" })
      const data = await res.json()
      
      if (data.success) {
        toast.success("Transmission successfully purged.")
        setItems(items.filter(item => item._id !== id))
      } else {
        toast.error(data.error || "Deletions command failed.")
      }
    } catch (error) {
      toast.error("Protocol error during deletion.")
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="min-h-screen w-screen bg-black text-white font-sans flex flex-col relative overflow-x-hidden">
      <div className="relative z-10 flex flex-col h-full w-full lg:max-w-7xl lg:mx-auto">
        <TerminalHeader />

        <main className="flex-1 p-4 md:p-12 lg:p-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-red-500/10 border border-red-500/20">
                <Shield className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                Admin_Override
              </h1>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">Vault_Management_Console</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center font-mono text-zinc-700 tracking-[0.5em] animate-pulse">
                SCANNING_VAULT_LOGS...
              </div>
            ) : (
                <div className="border border-white/5 bg-zinc-900/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/10 uppercase font-mono text-[10px] tracking-widest text-zinc-500 text-center">
                            <tr>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4 text-left">Manifest_Title</th>
                                <th className="p-4">Author_Node</th>
                                <th className="p-4">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item) => (
                                <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-mono text-[10px] text-zinc-500 text-center">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold uppercase tracking-tight">{item.title}</span>
                                            <span className="text-[9px] font-mono text-zinc-700 italic">{item._id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center font-mono text-xs text-zinc-400">
                                        {item.author || 'Anonymous'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => deleteItem(item._id)}
                                            className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-none"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {items.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <AlertTriangle className="w-10 h-10 text-zinc-800 mx-auto" />
                            <p className="font-mono text-xs text-zinc-700 uppercase tracking-widest">No transmissions found in vault.</p>
                        </div>
                    )}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
