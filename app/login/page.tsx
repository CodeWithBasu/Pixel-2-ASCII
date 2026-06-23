"use client"

import { useState } from "react"
import { TerminalHeader } from "@/components/terminal-header"
import Lightfall from "@/components/Lightfall"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Authorization granted. Welcome back.")
        router.push("/")
        router.refresh()
      } else {
        toast.error(data.error || "Uplink failed. Check credentials.")
      }
    } catch (error) {
      toast.error("Internal core error during handshake.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40">
        <Lightfall colors={['#A6C8FF', '#5227FF', '#FF9FFC']} backgroundColor="#0A29FF" speed={1} streakCount={8} streakWidth={1} streakLength={1} glow={1} density={1} twinkle={1} zoom={2} backgroundGlow={1} opacity={1} mouseInteraction={true} mouseStrength={1} mouseRadius={0.6} />
      </div>

      <div className="relative z-10 flex flex-col h-full w-full lg:max-w-7xl lg:mx-auto">
        <TerminalHeader />

        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md border border-white/10 bg-zinc-900/20 backdrop-blur-md p-8 md:p-12"
          >
            <div className="mb-10 text-center">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.5em] block mb-2">Security_Protocol</span>
              <h1 className="text-4xl font-black tracking-tighter uppercase">Initialize_Login</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Email_Uplink</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3 font-mono text-sm focus:border-white transition-colors outline-none"
                  placeholder="user@ascii.studio"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Secure_Cipher</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3 font-mono text-sm focus:border-white transition-colors outline-none"
                  placeholder="********"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {loading ? "AUTHENTICATING..." : "ENTRY_COMMAND"}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-zinc-600 font-mono">
              New node? <Link href="/signup" className="text-white hover:underline underline-offset-4">Register_ID</Link>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
