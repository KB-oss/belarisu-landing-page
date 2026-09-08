'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const KEY = 'bmc.golf-modal-seen'

const CLD = 'https://res.cloudinary.com/dtqbzj2sg/image/upload'
const BANNER = 'v1788900416/belarisu/golf-day/golf-day-banner.webp'
/* Ball sits far right and is the only golf cue; g_auto keeps it at this ratio. */
const MODAL_IMG = `${CLD}/f_auto,q_auto,c_fill,g_auto,ar_2:1,w_1000/${BANNER}`

const NAVY = '#071e36'
const ORANGE = '#ff7518'

function seen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    /* Can't read storage — treat as seen so we never nag on every page view. */
    return true
  }
}

export default function GolfDayModal({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const closeRef = useRef<HTMLButtonElement>(null)

  /* Pointless on the page it advertises, and it would cover the hero. */
  const suppressed = pathname === '/golf-day'

  useEffect(() => {
    if (!enabled || suppressed || seen()) return
    const t = window.setTimeout(() => setOpen(true), 1400)
    return () => window.clearTimeout(t)
  }, [enabled, suppressed])

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* Not persistable; it still closes for this page view. */
    }
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    /* Lenis keeps scrolling the page behind a fixed overlay otherwise. */
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      window.__lenis?.start()
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={dismiss}
          style={{ background: 'rgba(7,30,54,0.62)' }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="golf-modal-title"
            className="relative w-full max-w-[440px] overflow-hidden rounded-[22px] bg-white"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={e => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: 'rgba(255,255,255,0.9)', color: NAVY, outlineColor: ORANGE }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="relative">
              <img src={MODAL_IMG} alt="" className="w-full h-[168px] object-cover" />
              <div className="absolute left-0 bottom-0 flex items-end gap-2.5 px-5 py-3.5" style={{ background: NAVY }}>
                <span className="font-black text-white leading-[0.8] tracking-tighter text-[30px]">02</span>
                <span className="pb-0.5">
                  <span className="block font-black text-white text-[12.5px] leading-tight">October 2026</span>
                  <span className="block text-[10.5px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>World Smile Day</span>
                </span>
              </div>
            </div>

            <div className="px-7 py-7">
              <p className="font-black uppercase tracking-[2.5px] mb-2.5" style={{ fontSize: '10px', color: ORANGE }}>
                Upcoming event
              </p>
              <p id="golf-modal-title" className="font-black text-[23px] leading-tight tracking-tight mb-3" style={{ color: NAVY }}>
                Swing For Smiles Charity Golf
              </p>
              <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: '#62748e' }}>
                Play the course at Karen Country Club and fund cleft surgery, therapy and follow-up
                care. Entries from KSH 4,000.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  href="/golf-day"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 font-black text-[13px] px-7 py-3.5 rounded-full transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: ORANGE, color: '#fff', outlineColor: NAVY }}
                >
                  Register to play
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-[13px] font-bold transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
                  style={{ color: '#62748e', outlineColor: ORANGE }}
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
