'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function PageLoader() {
  const [visible, setVisible] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const duration = 2400

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const t = setTimeout(() => setVisible(false), 2900)
    return () => {
      clearTimeout(t)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Content — fades out before halves split */}
          <motion.div
            key="loader-content"
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center pointer-events-none gap-5"
            exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
          >
            <motion.img
              src="/LIGHT.webp"
              alt="BMC"
              style={{ height: '42px', width: 'auto' }}
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Thin progress bar */}
            <div
              className="w-[120px] h-[2px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#ff7518', width: `${count}%` }}
              />
            </div>
          </motion.div>

          {/* Top curtain — slides up to reveal */}
          <motion.div
            key="loader-top"
            className="fixed inset-x-0 top-0 z-[9999]"
            style={{ height: '50vh', background: '#071e36' }}
            exit={{ y: '-100%', transition: { duration: 0.72, delay: 0.12, ease: [0.76, 0, 0.24, 1] } }}
          />

          {/* Bottom curtain — slides down to reveal */}
          <motion.div
            key="loader-bottom"
            className="fixed inset-x-0 bottom-0 z-[9999]"
            style={{ height: '50vh', background: '#071e36' }}
            exit={{ y: '100%', transition: { duration: 0.72, delay: 0.12, ease: [0.76, 0, 0.24, 1] } }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
