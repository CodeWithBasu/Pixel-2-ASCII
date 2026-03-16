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
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    // Generate styles strictly on the client
    const styles = [...new Array(number)].map(() => ({
      "--angle": angle + "deg",
      top: -50 + Math.floor(Math.random() * (window.innerHeight / 2)) + "px", // Spaced across the top half
      left: Math.floor(Math.random() * window.innerWidth * 1.5) + "px", // Started off-screen right
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
            "animate-meteor pointer-events-none absolute w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-20 -translate-y-1/2 bg-gradient-to-r from-white to-transparent opacity-80" />
        </span>
      ))}
    </>
  )
}
