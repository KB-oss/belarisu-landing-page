'use client'

import Link from 'next/link'
import Reveal from './Reveal'

/* Compact promo for /golf-day, for pages that shouldn't give the event a full
   card. Same Cloudinary banner as the /golf-day hero and the home teaser.
   The ball sits far right and is the only golf cue, so the narrow crop anchors
   east — g_auto drops it once the frame turns portrait. */
const CLD = 'https://res.cloudinary.com/dtqbzj2sg/image/upload'
const BANNER = 'v1788900416/belarisu/golf-day/golf-day-banner.webp'
const STRIP_WIDE = `${CLD}/f_auto,q_auto,c_fill,g_auto,ar_32:9,w_1800/${BANNER}`
const STRIP_NARROW = `${CLD}/f_auto,q_auto,c_fill,g_east,ar_16:9,w_900/${BANNER}`

const NAVY = '#071e36'
const ORANGE = '#ff7518'
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function GolfDayStrip({ className = 'py-12 lg:py-16' }: { className?: string }) {
  return (
    <section className={className}>
      <div className={WRAP}>
        <Reveal direction="up">
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px]" style={{ background: NAVY }}>
            <picture>
              <source media="(min-width: 768px)" srcSet={STRIP_WIDE} />
              <img src={STRIP_NARROW} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </picture>

            {/* Copy sits left at every size; the scrim only has to protect that side. */}
            <div
              className="absolute inset-0 md:hidden"
              style={{ background: 'linear-gradient(to bottom, rgba(7,30,54,0.90) 0%, rgba(7,30,54,0.72) 60%, rgba(7,30,54,0.86) 100%)' }}
            />
            <div
              className="absolute inset-0 hidden md:block"
              style={{ background: 'linear-gradient(to right, rgba(7,30,54,0.94) 0%, rgba(7,30,54,0.86) 42%, rgba(7,30,54,0.42) 72%, rgba(7,30,54,0.16) 100%)' }}
            />

            <div className="relative px-7 py-8 sm:px-10 sm:py-9 lg:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
              <div>
                <p className="font-black uppercase tracking-[2.5px] mb-2.5" style={{ fontSize: '10px', color: ORANGE }}>
                  Upcoming event
                </p>
                <p className="text-white font-black leading-tight tracking-tight mb-2.5" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.9rem)' }}>
                  Swing For Smiles Charity Golf
                </p>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  02 October 2026 &middot; Karen Country Club, Nairobi &middot; from KSH 4,000
                </p>
              </div>

              <Link
                href="/golf-day"
                className="shrink-0 self-start md:self-auto inline-flex items-center gap-2 font-black text-[13px] px-7 py-3.5 rounded-full transition-colors hover:bg-white hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: ORANGE, color: '#fff', outlineColor: '#fff' }}
              >
                Register to play
                <ArrowRight />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
