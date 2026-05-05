'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import React from 'react'

interface SpotlightState {
  x: number
  y: number
  opacity: number
}

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
}

export default function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState<SpotlightState>({ x: 0, y: 0, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => setSpotlight((s) => ({ ...s, opacity: 0 }))

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,117,24,0.12), transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  )
}
