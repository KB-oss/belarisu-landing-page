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
  /** Automatically animate the slider left to right and right to left continuously */
  autoAnimate?: boolean
  /** Duration of a full cycle (0% → 100% → 0%) in milliseconds */
  animationDuration?: number
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
  autoAnimate = false,
  animationDuration = 4000,
}: ImageComparisonSliderProps) {
  const [internalIndex, setInternalIndex] = useState<number>(0)
  const [position, setPosition] = useState<number>(scrollReveal ? 100 : (autoAnimate ? 0 : 50))
  const [dragging, setDragging] = useState<boolean>(false)
  const hasRevealed = useRef<boolean>(false)
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)
  const animationFrameRef = useRef<number | null>(null)
  const animationStartTimeRef = useRef<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex
  const currentImage = images[currentIndex]

  // Start the continuous back-and-forth animation
  const startAutoAnimation = useCallback(() => {
    if (!autoAnimate || hasInteracted || dragging) return
    
    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    animationStartTimeRef.current = null
    
    const animate = (timestamp: number) => {
      if (!autoAnimate || hasInteracted || dragging) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        return
      }
      
      if (!animationStartTimeRef.current) {
        animationStartTimeRef.current = timestamp
      }
      
      const elapsed = timestamp - animationStartTimeRef.current
      
      // Calculate progress through a full cycle (0 to 2)
      // 0-1: moving from 0 to 100 (left to right)
      // 1-2: moving from 100 to 0 (right to left)
      const cycleProgress = (elapsed % (animationDuration * 2)) / (animationDuration * 2)
      let newPosition: number
      
      if (cycleProgress <= 0.5) {
        // First half: 0% → 100% (left to right)
        const t = cycleProgress * 2 // Convert to 0-1 range
        // Easing for smooth motion
        const eased = 1 - Math.pow(1 - t, 3)
        newPosition = eased * 100
      } else {
        // Second half: 100% → 0% (right to left)
        const t = (cycleProgress - 0.5) * 2 // Convert to 0-1 range
        // Easing for smooth motion
        const eased = Math.pow(t, 3)
        newPosition = 100 - (eased * 100)
      }
      
      setPosition(newPosition)
      
      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [autoAnimate, animationDuration, hasInteracted, dragging])
  
  // Stop the auto animation
  const stopAutoAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    animationStartTimeRef.current = null
  }, [])
  
  // Reset animation for new image
  const resetAnimationForNewImage = useCallback(() => {
    if (autoAnimate && !hasInteracted) {
      // Reset position to 0
      setPosition(0)
      // Restart animation
      stopAutoAnimation()
      // Small delay to ensure smooth restart
      setTimeout(() => {
        startAutoAnimation()
      }, 50)
    }
  }, [autoAnimate, hasInteracted, stopAutoAnimation, startAutoAnimation])
  
  // Start/stop animation based on props and interaction
  useEffect(() => {
    if (autoAnimate && !hasInteracted && !dragging) {
      startAutoAnimation()
    } else {
      stopAutoAnimation()
    }
    
    return () => {
      stopAutoAnimation()
    }
  }, [autoAnimate, hasInteracted, dragging, startAutoAnimation, stopAutoAnimation])
  
  // Reset animation when image changes
  useEffect(() => {
    resetAnimationForNewImage()
  }, [currentIndex, resetAnimationForNewImage])

  const move = useCallback(
    (clientX: number) => {
      if (!dragging || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      setPosition(pos)
      
      // Stop auto-animation on user interaction
      if (autoAnimate && !hasInteracted) {
        setHasInteracted(true)
        stopAutoAnimation()
      }
    },
    [dragging, autoAnimate, hasInteracted, stopAutoAnimation],
  )

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length
    if (onIndexChange) {
      onIndexChange(nextIndex)
    } else {
      setInternalIndex(nextIndex)
    }
    // Reset interaction state when manually changing images with autoAnimate
    if (autoAnimate) {
      setHasInteracted(false)
      setPosition(0)
      stopAutoAnimation()
      setTimeout(() => {
        startAutoAnimation()
      }, 100)
    }
  }, [currentIndex, images.length, onIndexChange, autoAnimate, stopAutoAnimation, startAutoAnimation])

  const previousImage = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    if (onIndexChange) {
      onIndexChange(prevIndex)
    } else {
      setInternalIndex(prevIndex)
    }
    // Reset interaction state when manually changing images with autoAnimate
    if (autoAnimate) {
      setHasInteracted(false)
      setPosition(0)
      stopAutoAnimation()
      setTimeout(() => {
        startAutoAnimation()
      }, 100)
    }
  }, [currentIndex, images.length, onIndexChange, autoAnimate, stopAutoAnimation, startAutoAnimation])

  useEffect(() => {
    if (autoPlayInterval > 0 && images.length > 1 && !autoAnimate) {
      autoPlayRef.current = setInterval(nextImage, autoPlayInterval)
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      }
    }
  }, [nextImage, autoPlayInterval, images.length, autoAnimate])

  const pauseAutoplay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
  }, [])

  const resumeAutoplay = useCallback(() => {
    if (autoPlayInterval > 0 && images.length > 1 && !autoAnimate && !hasInteracted) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      autoPlayRef.current = setInterval(nextImage, autoPlayInterval)
    }
  }, [nextImage, autoPlayInterval, images.length, autoAnimate, hasInteracted])

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAutoAnimation()
    }
  }, [stopAutoAnimation])

  // Scroll-reveal: animate divider from 100 → 50 to reveal the After image
  useEffect(() => {
    if (!scrollReveal || hasRevealed.current) return
    hasRevealed.current = true
    const delay = setTimeout(() => {
      const duration = 1400
      const start = performance.now()
      const from = 100
      const to = 50
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
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
      className={`relative select-none overflow-hidden rounded-2xl w-full ${className}`}
      onMouseMove={(e) => move(e.clientX)}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* BASE LAYER: BEFORE image */}
      <img 
        src={currentImage.before} 
        alt={altBefore} 
        className="h-full w-full object-cover bg-[#071e36]" 
        draggable={false} 
      />
      
      {/* BEFORE badge */}
      <div className="absolute top-5 left-5 bg-navy/70 backdrop-blur-sm text-white text-[10px] font-black tracking-[2px] uppercase px-3 py-1.5 rounded-full z-10">
        Before
      </div>

      {/* AFTER LAYER */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img 
          src={currentImage.after} 
          alt={altAfter} 
          className="h-full w-full object-cover bg-[#071e36]" 
          draggable={false} 
        />
        
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

      {/* Animation Status Indicator */}
      {autoAnimate && !hasInteracted && !dragging && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-30">
          <span className="text-white text-[10px] font-black tracking-wide flex items-center gap-2">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4 31.4" />
              <path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12" stroke="currentColor" strokeWidth="2" />
            </svg>
            Auto comparing...
          </span>
        </div>
      )}

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize z-30"
        style={{ left: `${position}%` }}
        onMouseDown={() => {
          setDragging(true)
          if (autoAnimate && !hasInteracted) {
            setHasInteracted(true)
            stopAutoAnimation()
          }
        }}
        onTouchStart={() => {
          setDragging(true)
          if (autoAnimate && !hasInteracted) {
            setHasInteracted(true)
            stopAutoAnimation()
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
                  if (autoAnimate) {
                    setHasInteracted(false)
                    setPosition(0)
                    stopAutoAnimation()
                    setTimeout(() => {
                      startAutoAnimation()
                    }, 100)
                  }
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