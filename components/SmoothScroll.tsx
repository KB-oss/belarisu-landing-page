'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import React from 'react'

// Extend Window to allow __lenis
declare global {
  interface Window {
    __lenis: Lenis | null
  }
}

interface SmoothScrollProps {
  children: React.ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,            // 0.1 = smooth but responsive; lower = more momentum
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
    })

    // Expose globally so other components can trigger smooth scrollTo
    window.__lenis = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return children
}
