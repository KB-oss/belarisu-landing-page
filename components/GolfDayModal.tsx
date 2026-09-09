'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const KEY = 'bmc.golf-modal-seen'

const CLD = 'https://res.cloudinary.com/dtqbzj2sg/image/upload'
const BANNER = 'v1788900416/belarisu/golf-day/golf-day-banner.webp'
/* The card is portrait, and g_auto drops the ball once the frame turns tall —
   the same trap as the hero and the home teaser — so anchor east. */
const MODAL_IMG = `${CLD}/f_auto,q_auto,c_fill,g_east,ar_4:5,w_900/${BANNER}`

const NAVY = '#071e36'
const ORANGE = '#ff7518'
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"

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

  /* Pointless on the page it advertises, and it would cover the hero. Also held
     back on the legal pages — someone reading a privacy policy shouldn't be
     interrupted by a promo. */
  const suppressed =
    pathname === '/golf-day' || pathname === '/privacy-policy' || pathname === '/terms-of-service'

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
            /* Photo-led, like the /golf-day hero it opens onto — rather than a
               white card that looks like every other announcement modal. */
            className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] flex flex-col justify-end min-h-[520px] sm:min-h-[560px]"
            style={{ background: NAVY }}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={e => e.stopPropagation()}
          >
            <img src={MODAL_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(7,30,54,0.30) 0%, rgba(7,30,54,0.42) 34%, rgba(7,30,54,0.93) 72%, rgba(7,30,54,0.98) 100%)' }}
            />

            <button
              ref={closeRef}
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: 'rgba(255,255,255,0.16)', color: '#fff', outlineColor: '#fff' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Date badge, top-left — the one fact worth reading first */}
            <div className="absolute top-4 left-4 z-10 flex items-end gap-2.5 px-4 py-3 rounded-[14px]" style={{ background: 'rgba(7,30,54,0.82)' }}>
              <span className="font-black text-white leading-[0.8] tracking-tighter text-[28px]">02</span>
              <span className="pb-0.5">
                <span className="block font-black text-white text-[12px] leading-tight">October 2026</span>
                <span className="block text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.62)' }}>World Smile Day</span>
              </span>
            </div>

            <div className="relative px-7 pb-7 pt-10">
              <p className="font-black uppercase tracking-[2.5px] mb-3" style={{ fontSize: '10px', color: ORANGE }}>
                Upcoming event
              </p>
              <p id="golf-modal-title" className="text-white font-black text-[27px] leading-[1.08] tracking-tight mb-3.5">
                Swing For Smiles{' '}
                <em className="not-italic whitespace-nowrap" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: ORANGE }}>Charity Golf</em>
              </p>
              <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Play Karen Country Club and fund cleft surgery, therapy and follow-up care.
                Entries from KSH 4,000.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link
                  href="/golf-day"
                  onClick={dismiss}
                  className="inline-flex items-center gap-2 font-black text-[13px] px-7 py-3.5 rounded-full transition-colors hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: ORANGE, color: '#fff', outlineColor: '#fff' }}
                >
                  Register to play
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-[13px] font-bold transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
                  style={{ color: 'rgba(255,255,255,0.6)', outlineColor: ORANGE }}
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
