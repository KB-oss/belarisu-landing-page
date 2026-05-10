'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ─── Assets ─── */
const LOGO_URL_DARK = './DARK.webp'
const LOGO_URL_LIGHT = './LIGHT.webp'

/* Pages where the hero is dark (nav starts white when unscrolled) */
const DARK_HERO_PAGES = new Set(['/'])

const ORANGE = '#ff7518'

interface NavLink { label: string; to: string }

const links: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Unstitched', to: '/unstitched' },
  { label: 'Contact', to: '/contact' },
]

/* Small icons */
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 5.55 5.55l.95-.95a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
function ExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [navVisible, setNavVisible] = useState<boolean>(true)

  const pathname = usePathname()
  const lastScrollY = useRef<number>(0)
  const menuOpenRef = useRef<boolean>(false)

  /* keep ref in sync so the scroll handler can read latest value */
  useEffect(() => { menuOpenRef.current = menuOpen }, [menuOpen])

  /* close on route change */
  useEffect(() => { setMenuOpen(false) }, [pathname])

  /* scroll: detect direction + threshold */
  useEffect(() => {
    const handler = () => {
      if (menuOpenRef.current) return          // never hide while menu is open
      const curr = window.scrollY
      const delta = curr - lastScrollY.current

      if (curr > 80 && delta > 10) setNavVisible(false)  // scrolling down
      if (delta < -4) setNavVisible(true)   // scrolling up (even a little)
      if (curr <= 80) setNavVisible(true)   // near top — always visible

      setScrolled(curr > 60)
      lastScrollY.current = curr
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* always re-show when menu opens */
  useEffect(() => { if (menuOpen) setNavVisible(true) }, [menuOpen])

  /* lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* colour logic */
  const onDark = scrolled || DARK_HERO_PAGES.has(pathname)
  const textMain = onDark ? '#ffffff' : '#071e36'
  const textMuted = onDark ? 'rgba(255,255,255,0.72)' : 'rgba(7,30,54,0.60)'
  const borderClr = onDark ? 'rgba(255,255,255,0.18)' : 'rgba(7,30,54,0.16)'
  const hamColor = menuOpen ? '#ffffff' : (onDark ? '#ffffff' : '#071e36')

  return (
    <>
      {/* ── Main bar ── */}
      <motion.header
        className="fixed top-5 inset-x-0 z-50"
        initial={{ y: -40, opacity: 0 }}
        animate={{
          y: navVisible ? 0 : '-130%',
          opacity: navVisible ? 1 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      >
        <div className="max-w-[1366px] mx-auto px-4 sm:px-5">
          <motion.div
            className="rounded-[28px] transition-all duration-500 "
            style={scrolled
              ? { background: 'rgba(7,30,54,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 8px 36px rgba(7,30,54,0.30)' }
              : { background: 'transparent', backdropFilter: 'none', boxShadow: 'none' }
            }
          >
            <div className={cn("flex items-center justify-between px-4 sm:px-5 py-3", menuOpen && 'px-2!')}>

              {/* Logo */}
              <Link href="/" className="shrink-0 flex items-center">
                <motion.img
                  src={ LOGO_URL_LIGHT }
                  alt="BelaRisu Medical Centre"
                  className={cn("object-contain w-auto h-6 sm:h-7 md:h-8 max-h-[30px]", menuOpen && 'h-8')}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />
              </Link>

              {/* Desktop nav links */}
              <nav className="hidden lg:flex items-center gap-1">
                {links.map(({ label, to }) => {
                  const isActive = pathname === to
                  return (
                    <Link key={to} href={to} className="relative group">
                      <motion.div
                        className="px-3.5 py-2 rounded-[12px] transition-colors duration-200"
                        animate={{ background: isActive ? 'rgba(255,117,24,0.12)' : 'transparent' }}
                        whileHover={{ background: isActive ? 'rgba(255,117,24,0.15)' : 'rgba(255,255,255,0.07)' }}
                        transition={{ duration: 0.15 }}
                      >
                        <motion.span
                          className="block text-[13px] tracking-[0.2px] font-semibold whitespace-nowrap"
                          animate={{ color: isActive ? ORANGE : textMuted }}
                          whileHover={{ color: isActive ? ORANGE : textMain }}
                          transition={{ duration: 0.15 }}
                        >
                          {label}
                        </motion.span>
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* Desktop CTAs */}
              <div className="hidden lg:flex items-center gap-2">
                <a
                  href="https://www.belarisufoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.2px] font-semibold px-4 py-2 rounded-full border transition-all duration-200 hover:border-[#ff7518]"
                  style={{ borderColor: borderClr, color: textMain }}
                >
                  Belarisu Foundation <ExternalIcon />
                </a>
                <Link
                  href="/booking"
                  className="bg-accent text-white text-[12px] tracking-[0.2px] font-bold px-5 py-2 rounded-full transition-all duration-200 hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98]"
                  style={{ boxShadow: '0 4px 14px rgba(255,117,24,0.32)' }}
                >
                  Book Appointment
                </Link>
              </div>

              {/* Hamburger */}
              <button
                className="lg:hidden flex flex-col gap-[5px] p-2.5 rounded-[10px] transition-colors duration-200"
                style={{ background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                onClick={() => setMenuOpen(v => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <motion.span
                  className="block w-5 h-[2px] rounded-full origin-center"
                  style={{ background: hamColor }}
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                />
                <motion.span
                  className="block w-5 h-[2px] rounded-full"
                  style={{ background: hamColor }}
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.18 }}
                />
                <motion.span
                  className="block w-5 h-[2px] rounded-full origin-center"
                  style={{ background: hamColor }}
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                />
              </button>

            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: '#071e36' }}
            initial={{ opacity: 0, clipPath: 'ellipse(8% 8% at 92% 6%)' }}
            animate={{ opacity: 1, clipPath: 'ellipse(160% 160% at 92% 6%)' }}
            exit={{ opacity: 0, clipPath: 'ellipse(8% 8% at 92% 6%)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {/* Subtle dot grid bg */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Top bar with logo + close area */}
            {/* <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4">
              <img src={scrolled ? LOGO_URL_LIGHT : LOGO_URL_DARK} alt="BMC" style={{ height: 26, width: 'auto' }} className="object-contain opacity-90" />
              <span className="text-white/40 text-[11px] font-black tracking-[2px] uppercase">Menu</span>
            </div> */}

            {/* Nav links */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 gap-1 mt-20">
              {links.map(({ label, to }, i) => {
                const isActive = pathname === to
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.055, duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  >
                    <Link
                      href={to}
                      className="group flex items-center justify-between py-3.5 border-b"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <span
                        className="text-[28px] font-black tracking-[-0.5px] transition-colors duration-200"
                        style={{ color: isActive ? ORANGE : 'rgba(255,255,255,0.88)' }}
                      >
                        {label}
                      </span>
                      <span
                        className="font-black tabular-nums transition-colors duration-200"
                        style={{ fontSize: '11px', color: isActive ? ORANGE : 'rgba(255,255,255,0.22)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom area */}
            <motion.div
              className="relative z-10 px-6 pb-10 pt-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.42 }}
            >
              {/* CTA buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <Link
                  href="/booking"
                  className="w-full text-center bg-accent text-white text-[15px] font-black py-4 rounded-[16px] transition-all hover:bg-accent-dark active:scale-[0.98]"
                  style={{ boxShadow: '0 6px 24px rgba(255,117,24,0.35)' }}
                >
                  Book Appointment
                </Link>
                <a
                  href="https://www.belarisufoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center text-white/70 text-[14px] font-semibold py-3.5 rounded-[16px] border border-white/12 hover:border-white/25 transition-all"
                >
                  Visit Foundation Site
                </a>
              </div>

              {/* Contact info strip */}
              <div className="flex flex-col gap-2.5">
                <a href="tel:+254722872872" className="flex items-center gap-2.5 text-white/50 text-[12.5px] font-medium hover:text-white/80 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-white/08 flex items-center justify-center shrink-0"><PhoneIcon /></span>
                  +254 722 872 872
                </a>
                <a href="mailto:info@belarisumedicalcentre.org" className="flex items-center gap-2.5 text-white/50 text-[12.5px] font-medium hover:text-white/80 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-white/08 flex items-center justify-center shrink-0"><MailIcon /></span>
                  info@belarisumedicalcentre.org
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
