import { useState, useEffect } from "react"

export function useResponsive() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isShortScreen: false,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width: width,
        height: height,
        isShortScreen: height < 850, // Flag for screens that are vertically challenged
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return device
}
