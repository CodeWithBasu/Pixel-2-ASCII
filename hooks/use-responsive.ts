import { useState, useEffect } from "react"

export function useResponsive() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth
      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width: width,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return device
}
