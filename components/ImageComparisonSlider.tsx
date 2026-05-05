'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ImageComparisonSliderProps {
  beforeImage: string
  afterImage: string
  altBefore?: string
  altAfter?: string
  className?: string
}

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  altBefore = 'Before',
  altAfter = 'After',
  className = '',
}: ImageComparisonSliderProps) {
  const [position, setPosition] = useState<number>(50)
  const [dragging, setDragging] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  const move = useCallback(
    (clientX: number) => {
      if (!dragging || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      setPosition(pos)
    },
    [dragging],
  )

  useEffect(() => {
    const up = () => setDragging(false)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-2xl ${className}`}
      onMouseMove={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* Before layer */}
      <img src={beforeImage} alt={altBefore} className="h-full w-full object-cover" draggable={false} />
      <div className="absolute top-5 left-5 bg-navy/70 backdrop-blur-sm text-white text-[10px] font-black tracking-[2px] uppercase px-3 py-1.5 rounded-full">
        Before
      </div>

      {/* After layer — clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={afterImage} alt={altAfter} className="h-full w-full object-cover" draggable={false} />
        <div className="absolute top-5 left-5 bg-accent text-white text-[10px] font-black tracking-[2px] uppercase px-3 py-1.5 rounded-full">
          After
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize z-10"
        style={{ left: `${position}%` }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        <div
          className={`bg-white rounded-full w-11 h-11 shadow-xl flex items-center justify-center transition-transform duration-150 ${
            dragging ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
