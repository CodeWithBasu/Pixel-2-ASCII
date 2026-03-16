"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 6,
  maxDuration = 16,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    // Generate styles strictly on the client
    const styles = [...new Array(number)].map(() => ({
      "--angle": "-65deg", // Steep angle pointing up-right so that -X translates down-left (top-right to bottom-left)
      top: -50 + Math.floor(Math.random() * (window.innerHeight * 0.5)) + "px", // Spaced across the top half
      left: Math.floor(Math.random() * window.innerWidth * 1.5) + "px", // Spaced mostly to the right to fall inwards
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration: Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + "s",
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ ...(style as React.CSSProperties) }}
          className={cn(
            "animate-meteor pointer-events-none absolute w-px h-px rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-24 -translate-y-1/2 bg-linear-to-r from-white/60 to-transparent opacity-100" />
        </span>
      ))}
    </>
  )
}
