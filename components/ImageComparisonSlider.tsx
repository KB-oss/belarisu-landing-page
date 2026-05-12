'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ImagePair {
  before: string
  after: string
  patientName: string
  age?: string
  condition: string
  location: string
}

interface ImageComparisonSliderProps {
  images: ImagePair[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
  autoPlayInterval?: number
  altBefore?: string
  altAfter?: string
  className?: string
  showControls?: boolean
  /** When true, animates the divider from 100% → 50% to reveal the After image */
  scrollReveal?: boolean
}

export default function ImageComparisonSlider({
  images,
  currentIndex: externalIndex,
  onIndexChange,
  autoPlayInterval = 40000,
  altBefore = 'Before',
  altAfter = 'After',
  className = '',
  showControls = true,
  scrollReveal = false,
}: ImageComparisonSliderProps) {
  const [internalIndex, setInternalIndex] = useState<number>(0)
  const [position, setPosition] = useState<number>(scrollReveal ? 100 : 50)
  const [dragging, setDragging] = useState<boolean>(false)
  const hasRevealed = useRef<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(true)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const hintIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex
  const currentImage = images[currentIndex]

  const move = useCallback(
    (clientX: number) => {
      if (!dragging || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      setPosition(pos)
      
      // Hide hint on first interaction
      if (showHint && !hasInteracted) {
        setShowHint(false)
        setHasInteracted(true)
        if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
      }
    },
    [dragging, showHint, hasInteracted],
  )

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length
    if (onIndexChange) {
      onIndexChange(nextIndex)
    } else {
      setInternalIndex(nextIndex)
    }
    setPosition(50)
  }, [currentIndex, images.length, onIndexChange])

  const previousImage = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    if (onIndexChange) {
      onIndexChange(prevIndex)
    } else {
      setInternalIndex(prevIndex)
    }
    setPosition(50)
  }, [currentIndex, images.length, onIndexChange])

  useEffect(() => {
    if (autoPlayInterval > 0 && images.length > 1) {
      autoPlayRef.current = setInterval(nextImage, autoPlayInterval)
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      }
    }
  }, [nextImage, autoPlayInterval, images.length])

  const pauseAutoplay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
  }, [])

  const resumeAutoplay = useCallback(() => {
    if (autoPlayInterval > 0 && images.length > 1) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      autoPlayRef.current = setInterval(nextImage, autoPlayInterval)
    }
  }, [nextImage, autoPlayInterval, images.length])

  useEffect(() => {
    const up = () => setDragging(false)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
  }, [])

  // Passive touch-move listener so the browser can scroll without waiting for JS
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onTouchMove = (e: TouchEvent) => {
      move(e.touches[0].clientX)
    }
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [move])

  // Recurring hint every 30 seconds if no interaction
  useEffect(() => {
    if (!hasInteracted) {
      // Initial hint shows immediately
      setShowHint(true)
      
      // Set up interval to show hint every 30 seconds
      hintIntervalRef.current = setInterval(() => {
        if (!hasInteracted) {
          setShowHint(true)
        }
      }, 3000)
      
      return () => {
        if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
      }
    }
  }, [hasInteracted])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
    }
  }, [])

  // Scroll-reveal: animate divider from 100 → 50 when mounted with scrollReveal=true
  useEffect(() => {
    if (!scrollReveal || hasRevealed.current) return
    hasRevealed.current = true
    // Brief delay so the section has fully entered the viewport
    const delay = setTimeout(() => {
      const duration = 1400
      const start = performance.now()
      const from = 100
      const to = 50
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3)
        setPosition(from + (to - from) * eased)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 350)
    return () => clearTimeout(delay)
  }, [scrollReveal])

  if (!currentImage) return null

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-2xl ${className}`}
      onMouseMove={(e) => move(e.clientX)}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* BASE LAYER: BEFORE image */}
      <img src={currentImage.before} alt={altBefore} className="h-full w-full object-contain bg-[#071e36]" draggable={false} />
      
      {/* BEFORE badge */}
      <div className="absolute top-5 left-5 bg-navy/70 backdrop-blur-sm text-white text-[10px] font-black tracking-[2px] uppercase px-3 py-1.5 rounded-full z-10">
        Before
      </div>

      {/* AFTER LAYER */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img src={currentImage.after} alt={altAfter} className="h-full w-full object-contain bg-[#071e36]" draggable={false} />
        
        {/* AFTER badge */}
        <div className="absolute top-5 right-5 bg-accent text-white text-[10px] font-black tracking-[2px] uppercase px-3 py-1.5 rounded-full z-10">
          After
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none z-20"
        style={{ left: `${position}%`, willChange: 'left' }}
      />

         {/* Simple Draggability Hint - Recurring every 30 seconds - positioned above handle */}
         {showHint && !hasInteracted && (
        <div 
          className="absolute z-40 pointer-events-none animate-in fade-in zoom-in duration-300"
          style={{ 
            left: `${position}%`, 
            bottom: 'calc(50% + 40px)',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="relative">
            {/* Tooltip pointing down to the handle */}
            <div className="bg-black/85 backdrop-blur-md rounded-full px-4 py-2.5 shadow-2xl border border-white/20 flex items-center gap-2.5">
              {/* Drag icon */}
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
              </svg>
              
              {/* Simple text */}
              <span className="text-white text-sm font-semibold tracking-wide whitespace-nowrap">
                Drag to compare
              </span>
              
              {/* Small pulsing dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            
            {/* Arrow pointing down to the handle */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black/85 rotate-45 border-r border-b border-white/20" />
          </div>
        </div>
      )}

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize z-30"
        style={{ left: `${position}%` }}
        onMouseDown={() => {
          setDragging(true)
          if (!hasInteracted) {
            setHasInteracted(true)
            setShowHint(false)
            if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
          }
        }}
        onTouchStart={() => {
          setDragging(true)
          if (!hasInteracted) {
            setHasInteracted(true)
            setShowHint(false)
            if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
          }
        }}
        onMouseEnter={() => {
          if (!hasInteracted) {
            setHasInteracted(true)
            setShowHint(false)
            if (hintIntervalRef.current) clearInterval(hintIntervalRef.current)
          }
        }}
      >
        <div
          className={`bg-white rounded-full w-11 h-11 shadow-xl flex items-center justify-center transition-all duration-150 ${
            dragging ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center transition-all z-30 shadow-lg hover:scale-110"
            aria-label="Previous patient"
          >
            <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center transition-all z-30 shadow-lg hover:scale-110"
            aria-label="Next patient"
          >
            <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onIndexChange) {
                    onIndexChange(idx)
                  } else {
                    setInternalIndex(idx)
                  }
                  setPosition(50)
                }}
                className={`transition-all rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-accent'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-30">
            <span className="text-white text-[10px] font-black tracking-wide">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </>
      )}
    </div>
  )
}