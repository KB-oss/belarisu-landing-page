'use client'

import { useEffect, useRef } from 'react'
import { HeroScene } from '../webgl/HeroScene'

interface HeroGLProps {
  imageUrl: string
  className?: string
}

export default function HeroGL({ imageUrl, className = '' }: HeroGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HeroScene | null>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return

    sceneRef.current = new HeroScene(canvas, imageUrl)
    return () => sceneRef.current?.destroy()
  }, [imageUrl])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  )
}
