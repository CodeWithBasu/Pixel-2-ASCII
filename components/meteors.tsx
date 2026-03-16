"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  className?: string
}

export const Meteors = ({ number = 20, className }: MeteorsProps) => {
  const [meteors, setMeteors] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate meteors only on client
    const generated = [...Array(number)].map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * window.innerWidth * 1.5) - window.innerWidth * 0.2, // Spread wider
      delay: Math.random() * 2, // 0 to 2s delay
      duration: Math.random() * 3 + 2, // 2 to 5s falling
    }))
    setMeteors(generated)
  }, [number])

  return (
    <>
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0], // fade in, solid, fade out
            x: -window.innerWidth * 0.8, // Fall diagonally left
            y: window.innerHeight * 1.2, // Fall down
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: m.left,
            top: -100, // start above screen
          }}
          className={cn(
            "pointer-events-none absolute w-0.5 h-0.5 rounded-full bg-[#00FFAA] shadow-[0_0_0_1px_#00FFAA80]",
            className
          )}
        >
          {/* Meteor Tail - rotated fixed because Framer is moving the x/y natively without rotating the container along trajectory */}
          <div className="pointer-events-none absolute top-1/2 right-0 h-px w-24 -translate-y-1/2 bg-linear-to-l from-[#00FFAA] to-transparent opacity-80 style-tail" style={{ transformOrigin: "right", transform: "rotate(-56deg) translateY(-50%)" }} />
        </motion.div>
      ))}
    </>
  )
}
