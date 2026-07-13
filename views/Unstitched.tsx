'use client'

import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Assets ─── */
const IMG_HERO = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/v1778512762/Frame_50_gsozrp.png'

/* ═══════════════════════════════════════ */
export default function Unstitched() {
  return (
    <div className="pt-[88px]" style={{ background: '#fdfcfb', overflowX: 'clip' }}>
      <div className={`${WRAP} py-12 sm:py-16`}>
        <div className="flex flex-col rounded-[24px] overflow-hidden" style={{ boxShadow: '0px 20px 60px rgba(7,30,54,0.06)' }}>

          {/* ══════════════════════════════
              HERO — full-bleed image
          ══════════════════════════════ */}
          <Reveal direction="up">
            <div
              className="relative flex flex-col sm:flex-row items-end justify-between gap-6 px-8 sm:px-10 py-8 sm:py-10 rounded-tl-[24px] rounded-tr-[24px]"
              style={{ minHeight: '480px', background: '#111' }}
            >
              <img src={IMG_HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.50)' }} />

              <div className="relative z-10 flex flex-col gap-3 max-w-[680px]">
                <h1
                  className="font-black text-white leading-[1.12] tracking-[-0.05em]"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: PLAYFAIR, fontStyle: 'italic' }}
                >
                  We've heard the same story about cleft care for decades.
                </h1>
                <p
                  className="font-black leading-[1.25] tracking-[-0.04em]"
                  style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)', fontStyle: 'italic', color: '#ff7518', fontFamily: PLAYFAIR }}
                >
                  It's time to tell a different one.
                </p>
              </div>

              <div className="relative z-10 shrink-0">
                <motion.a
                  href="#article"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-[13px] px-5 py-3 rounded-full border border-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Read More
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>
            </div>
          </Reveal>

          {/* ══════════════════════════════
              ARTICLE BODY
          ══════════════════════════════ */}
          <Reveal direction="up" delay={0.1}>
            <div
              id="article"
              className="flex flex-col gap-6 px-8 sm:px-10 lg:px-14 py-10 sm:py-12 rounded-bl-[24px] rounded-br-[24px]"
              style={{ background: '#fdf8f2' }}
            >
              <div className="max-w-[860px] mx-auto w-full flex flex-col gap-6">
                <p className="leading-[1.85]" style={{ fontSize: '17px', color: '#3a3a3a' }}>
                  Stories of transformation, of before and after, have long shaped the narrative around cleft care — but the systems in between are rarely part of the conversation. And without them, the picture is never complete.
                </p>
                <div style={{ borderRight: '1px solid rgba(10,42,73,0.09)' }}>
                  <p className="leading-[1.85] pr-6 sm:pr-10" style={{ fontSize: '17px', color: '#3a3a3a' }}>
                    Unstitched is an invitation to look beyond the individual transformations and into the systems that shape who gets care, when they get it, and what happens after they do. It positions cleft as a lens into how health systems function, and how they fail. In doing so, it reveals the deeper patterns of inequality, access, infrastructure and policy that shape cleft care, often in ways that are not immediately visible.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  )
}
