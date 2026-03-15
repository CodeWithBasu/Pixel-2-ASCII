import type React from "react"

interface TerminalFrameProps {
  title?: string
  children: React.ReactNode
}

export function TerminalFrame({ title = "terminal", children }: TerminalFrameProps) {
  return (
    <div className="bg-background border border-border font-mono">
      <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground font-mono">{title}</div>
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>

      <div className="p-4">{children}</div>
    </div>
  )
}
