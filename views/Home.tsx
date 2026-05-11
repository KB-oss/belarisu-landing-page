'use client'

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion'
import Reveal from '../components/Reveal'
import ImageComparisonSlider from '../components/ImageComparisonSlider'
import { useDonation } from '../context/DonationContext'
import { Heart } from 'lucide-react'

/* ─── Assets ─── */
const HERO_IMGS = [
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778512766/Frame_52_eiru04.png',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778512764/Frame_51_rklxyx.png',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778512762/Frame_50_gsozrp.png',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778512757/Frame_49_wom4rs.png',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778512755/Frame_48_y96n0n.png'
]
const BEFORE_IMG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002965/1H4A1675_rngiou.jpg'
const AFTER_IMG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002968/1H4A2346_kosbyt.jpg'
const DONATE_IMG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246041/0B2A0278_1_sy7sb7.webp'

const PATIENT_GALLERY = [
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002965/1H4A1675_rngiou.jpg',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002968/1H4A2346_kosbyt.jpg',
    patientName: 'Blessing Wangui',
    age: '14 months old',
    condition: 'Cleft Lip',
    location: 'Mombasa'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778180685/david_before_zwo4zp.jpg',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778180681/david_after_dgjqtz.jpg',
    patientName: 'David',
    age: '',
    condition: 'Cleft Lip',
    location: 'Nairobi'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997453/Mateo_Ndungu_Kimiri_-_Cleft_Lip_and_Cleft_Palate_-_1_year_8_months_-_Juja_zrehfp.webp',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997452/Cleopatra_Njeri_Njunge_-_Cleft_Lip_and_Cleft_Palate_-_1_year_-_Kiambu_xeipzy.webp',
    patientName: 'Cleopatra Njeri Njunge',
    age: '1 years old',
    condition: 'Cleft Lip and Cleft_Palat',
    location: 'Kisumu'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997449/Lucrecia_Reina_Khalumba_-_Cleft_Lip_-_4_years_-_Nairobi_kubatv.webp',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997450/Lucrecia_Reina_Khalumba_-_Cleft_Lip_-_4_years_-_Nairobi_1_j8f9hg.webp',
    patientName: 'Lucrecia Reina Khalumba',
    age: '4 years old',
    condition: 'Cleft Lip',
    location: 'Nairobi'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997451/Abdirakib_Ismail_-_Cleft_Lip_and_Cleft_Palate_-_12_years_-_Garissa_xchfpp.webp',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997445/Abdirakib_Ismail_-_Cleft_Lip_and_Cleft_Palate_-_12_years_-_Garissa_1_twxz2t.webp',
    patientName: 'Abdirakib Ismail',
    age: '12 years old',
    condition: 'Cleft Lip',
    location: 'Nairobi'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997452/Amari_Nderitu_Muriithi_-_Cleft_Lip_-_2_months_-_Kiambu_pwxvbn.webp',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997448/Amari_Nderitu_Muriithi_-_Cleft_Lip_-_2_months_-_Kiambu_1_mp9xt9.webp',
    patientName: 'Amari Nderitu Muriithi',
    age: '2 Month old',
    condition: 'Cleft Lip',
    location: 'Kiambu'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997445/Bancy_Muthoni_-_Cleft_Lip_and_Cleft_Palate_-_11_months_-_Kiambu_grc2wf.webp',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997447/Bancy_Muthoni_-_Cleft_Lip_and_Cleft_Palate_-_11_months_-_Kiambu_1_zklutu.webp',
    patientName: 'Bancy Muthoni',
    age: '11 Months old',
    condition: 'Cleft Lip and Cleft Palate',
    location: 'Kiambu'
  },
  {
    before: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997447/Amelia_Chreseria_Njeri_-_Cleft_Lip_and_Cleft_Palate_-_4_years_-_Ruiru_t1zysd.webp',
    after: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997446/Amelia_Chreseria_Njeri_-_Cleft_Lip_and_Cleft_Palate_-_4_years_-_Ruiru_1_caajti.webp',
    patientName: 'Amelia Chreseria Njeri',
    age: '4 years old',
    condition: 'Cleft Lip and Cleft Palate',
    location: 'Riuru'
  }
]

interface ServiceItem {
  title: string
  desc: string
  img: string
  icon: React.ReactElement
}

const SERVICES: ServiceItem[] = [
  {
    title: 'Surgery',
    desc: 'Highly specialized surgical repair of cleft lip and cleft palate performed by experienced surgeons using modern techniques to restore function and appearance.',
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000764/Surgery_-_Home_cxgpe5.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Nutrition Support',
    desc: 'Children born with cleft conditions often face feeding challenges. Our nutrition team provides specialised guidance, growth monitoring, and nutritional rehabilitation.',
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778179995/nutrition-home_1_vpsqeq.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
  },
  {
    title: 'Orthodontics & Dental',
    desc: 'Orthodontic assessment and treatment guide proper jaw development, improve dental alignment, and support patients in long-term oral health as they grow.',
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778513801/WhatsApp_Image_2026-05-11_at_11.14.33_ysigtk.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
  {
    title: 'Speech & Language Therapy',
    desc: 'Speech therapy helps children and adults develop clear, confident communication following cleft palate repair, supporting them in school and social life.',
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000862/Speech_Therapy_aksuao.jpg',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'ENT Care',
    desc: 'Children with cleft conditions are at higher risk of ear infections and hearing loss. Regular ENT care monitors hearing, treats infections, and protects airway health.',
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000766/ENT_zwe3nh.png',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
  {
    title: 'Psychosocial Counseling',
    desc: 'Emotional wellbeing is as important as physical health. Our counselors support patients and families in building confidence, coping with stigma, and thriving socially.',
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000764/pshyocology_gsvwmr.png',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

const AUTO_INTERVAL = 7000
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Hooks ─── */
function useHeroSlider(
  images: string[],
  interval = 5000
): [number, Dispatch<SetStateAction<number>>] {
  const [idx, setIdx] = useState<number>(0)
  useEffect(() => { images.forEach((s) => { const i = new Image(); i.src = s }) }, [images])
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval)
    return () => clearInterval(t)
  }, [images.length, interval])
  return [idx, setIdx]
}

interface StatNumberProps {
  target: string | number
  suffix?: string
}

function StatNumber({ target, suffix = '' }: StatNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.6 })
  const [val, setVal] = useState<number>(0)
  useEffect(() => {
    if (!inView) return
    const num = parseInt(String(target))
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * num))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Icons ─── */
function ArrowUpRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )
}

interface ArrowRightProps {
  className?: string
}

function ArrowRight({ className = 'w-4 h-4' }: ArrowRightProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/* ─── Hero text animations ─── */
const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.75 } },
}
const heroItem: Variants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(14px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}
const heroHeadStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.95 } },
}
const heroWord: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -25, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

/* ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [heroIdx, setHeroIdx] = useHeroSlider(HERO_IMGS, 5000)
  const { openModal } = useDonation()
  const [activeService, setActiveService] = useState<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isHovered, setIsHovered] = useState(false);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0)
  const currentPatient = PATIENT_GALLERY[currentPatientIndex]




  function selectService(i: number) {
    setActiveService(i)
    if (timerRef.current !== null) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActiveService((x) => (x + 1) % SERVICES.length), AUTO_INTERVAL)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setActiveService((x) => (x + 1) % SERVICES.length), AUTO_INTERVAL)
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="bg-[#fdfcfb] overflow-x-hidden">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <div className="p-2.5">
        <section
          className="relative overflow-hidden rounded-[20px] sm:rounded-[24px]"
          style={{ height: 'calc(100vh - 40px)', minHeight: '600px' }}
        >
          {/* Crossfade images */}
          <AnimatePresence>
            <motion.img
              key={heroIdx}
              src={HERO_IMGS[heroIdx]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(5,5,5,0.0) 30%, rgba(5,5,5,0.0) 50%, rgba(5,5,5,0.78) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.0) 50%)' }}
          />
          {/* Top gradient — keeps nav + logo readable over any photo */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.0) 28%)' }}
          />

          {/* Slide indicators */}
          <div className="absolute bottom-7 right-8 z-20 flex gap-2 items-center">
            {HERO_IMGS.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === heroIdx ? 'w-8 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>

          {/* Copy */}
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="w-full px-8 sm:px-12 lg:px-16 pb-14 sm:pb-18">
              <motion.div className="max-w-[680px]" variants={heroStagger} initial="hidden" animate="visible">

                {/* Accent bar */}
                <motion.div
                  variants={heroItem}
                  className="mb-7 rounded-full bg-accent"
                  style={{ width: 0, height: '2px' }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                />

                {/* Headline — word-by-word */}
                <motion.h1
                  className="leading-[0.95] tracking-[-0.045em] mb-6 text-white overflow-hidden"
                  style={{ fontSize: 'clamp(2.8rem, 5.8vw, 5.2rem)', fontWeight: 900, perspective: '600px' }}
                  variants={heroHeadStagger}
                  initial="hidden"
                  animate="visible"
                >
                  {['Where', ' '].map((w, i) => (
                    <motion.span key={i} className="inline-block" style={{ marginRight: w === ' ' ? '0.1em' : '0.15em' }} variants={heroWord}>{w}</motion.span>
                  ))}
                  <motion.em
                    className="not-italic text-accent inline-block"
                    style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', marginRight: '0.1em' }}
                    variants={heroWord}
                  >
                    Care
                  </motion.em>
                  <br />
                  {['Grows', 'with'].map((w, i) => (
                    <motion.span key={i} className="inline-block" style={{ marginRight: '0.28em' }} variants={heroWord}>{w}</motion.span>
                  ))}
                  <motion.em
                    className="not-italic text-accent inline-block"
                    style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}
                    variants={heroWord}
                  >
                    You
                  </motion.em>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={heroItem}
                  className="text-[15px] sm:text-[16px] leading-[1.9] mb-10 max-w-[400px] font-light"
                  style={{ color: 'rgba(255,255,255,0.90)' }}
                >
                  Giving every child the chance to live a healthy, confident life — regardless of where they were born.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={heroItem} className="flex items-center gap-5 flex-wrap">
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 bg-accent text-white font-bold text-sm px-7 py-3.5 rounded-full hover:bg-accent-dark transition-colors duration-200"
                      style={{ boxShadow: '0 4px 20px rgba(255,117,24,0.40)' }}
                    >
                      Book Appointment <ArrowUpRight />
                    </Link>
                  </motion.div>
                  <button
                    onClick={openModal}
                    className="group text-[13px] font-medium transition-all"
                    style={{ color: 'rgba(255,255,255,0.44)' }}
                  >
                    <span className="underline underline-offset-4 decoration-white/18 group-hover:text-white/80 group-hover:decoration-white/40 transition-all">
                      Support our mission
                    </span>
                  </button>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════
          OUR IMPACT
      ══════════════════════════════════ */}
      <section className="bg-navy overflow-hidden relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(255,117,24,0.07) 0%, transparent 65%)' }}
        />

        <div className={`${WRAP} relative`}>

          <Reveal direction="up">
            <div className="pt-20 pb-16 lg:pt-24 lg:pb-20 text-center">
              <p
                className="inline-flex items-center gap-2.5 mb-7 font-black tracking-[3.5px] uppercase"
                style={{ fontSize: '10px', color: 'rgba(255,117,24,0.65)' }}
              >
                <span className="block w-8 h-px" style={{ background: 'rgba(255,117,24,0.4)' }} />
                Our Impact
                <span className="block w-8 h-px" style={{ background: 'rgba(255,117,24,0.4)' }} />
              </p>
              <h2
                className="font-black leading-[1.06] text-white mx-auto"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)', letterSpacing: '-2.5px', maxWidth: '820px' }}
              >
                700 families.{' '}
                <em style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: '#ff7518' }}>
                  Not a single bill.
                </em>
              </h2>
              <p
                className="mt-5 mx-auto leading-relaxed"
                style={{ fontSize: '16px', color: 'rgba(255,255,255,0.72)', maxWidth: '460px' }}
              >
                Every surgery, every therapy session, every follow-up — completely free to every patient.
              </p>
            </div>
          </Reveal>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } } }}
          >
            {[
              { num: '700', suffix: '+', label: 'Lives Transformed', sub: 'Since 2022', desc: 'Patients who received comprehensive cleft care at no cost' },
              { num: '6', suffix: '+', label: 'Specialties', sub: 'Under one roof', desc: 'Surgery, orthodontics, speech, ENT, nutrition & psychosocial care' },
              { num: '100', suffix: '%', label: 'Free Care', sub: 'Always', desc: 'No fees, no waiting lists — every patient is treated' },
            ].map(({ num, suffix, label, sub, desc }) => (
              <motion.div
                key={label}
                className="group relative px-8 py-14 md:py-16 border-b md:border-b-0 md:border-r last:border-r-0"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                variants={{
                  hidden: { opacity: 0, y: 44, filter: 'blur(12px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{ background: 'rgba(255,117,24,0.035)' }}
                />
                <p
                  className="font-black leading-none mb-5 inline-flex items-baseline"
                  style={{ fontSize: 'clamp(4rem, 7vw, 7.5rem)', letterSpacing: '-5px', color: '#ffffff' }}
                >
                  <StatNumber target={num} suffix="" />
                  <span style={{ color: '#ff7518', marginLeft: '4px' }}>{suffix}</span>
                </p>
                <p className="text-white font-bold text-[15px] mb-1 tracking-[-0.2px]">{label}</p>
                <p
                  className="font-black uppercase tracking-[2.5px] mb-4"
                  style={{ fontSize: '9px', color: 'rgba(255,117,24,0.45)' }}
                >
                  {sub}
                </p>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', maxWidth: '210px' }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════
          TRANSFORMATIONS
      ══════════════════════════════════ */}
      <TransformSection currentPatientIndex={currentPatientIndex} setCurrentPatientIndex={setCurrentPatientIndex} currentPatient={currentPatient} />

      {/* ══════════════════════════════════
          SERVICES
      ══════════════════════════════════ */}
      <section className="py-16 xl:py-20 bg-[#fdfcfb]">
        <div className={WRAP}>
          <Reveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-20 items-end mb-14">
              <div>
                <p className="font-black tracking-[3.5px] uppercase mb-4" style={{ fontSize: '10px', color: '#ff7518' }}>Our Services</p>
                <h2 className="font-black leading-[1.06] tracking-[-1.5px] text-body" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)' }}>
                  Get to know our{' '}
                  <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>comprehensive care</em>
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-muted text-[15px] leading-[1.85]">Our multidisciplinary team addresses every dimension of cleft care — restoring health, function, and confidence across every stage of life.</p>
                <Link href="/services" className="self-start inline-flex items-center gap-2 text-accent font-bold text-[13px] group transition-all">
                  View all services <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-10 items-stretch">
            <div className="lg:col-span-2 flex flex-col gap-2">
              {SERVICES.map((svc, i) => {
                const isActive = i === activeService
                return (
                  <motion.div key={svc.title} className="rounded-[16px] cursor-pointer overflow-hidden transition-colors duration-200"
                    style={{ background: isActive ? '#fff' : 'transparent', boxShadow: isActive ? '0 2px 16px rgba(7,30,54,0.07), 0 0 0 1px rgba(7,30,54,0.06)' : 'none' }}
                    onClick={() => selectService(i)} layout transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
                    <div className="flex items-center gap-3 px-4 py-4 select-none">
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-250"
                        style={{ background: isActive ? 'rgba(255,117,24,0.10)' : '#eae6e0', color: isActive ? '#ff7518' : '#8a939f' }}>
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-[14.5px] transition-colors duration-200 block" style={{ color: isActive ? '#071e36' : '#62748e' }}>{svc.title}</span>
                      </div>
                      <span className="font-black tabular-nums shrink-0 transition-colors duration-200" style={{ fontSize: '10px', color: isActive ? '#ff7518' : 'rgba(7,30,54,0.15)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <motion.svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? '#ff7518' : '#c4ccd4' }}
                        animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] }}>
                        <path d="M3 6l5 5 5-5" />
                      </motion.svg>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] }} className="overflow-hidden">
                          <div className="lg:hidden mx-4 mb-3 rounded-[12px] overflow-hidden h-[180px] bg-[#ede9e3]">
                            <AnimatePresence mode="wait">
                              <motion.img key={activeService} src={svc.img} alt={svc.title} className="w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] }} />
                            </AnimatePresence>
                          </div>
                          <p className="text-muted text-[13.5px] leading-[1.78] px-4 pb-3">{svc.desc}</p>
                          <div className="flex items-center justify-between gap-4 px-4 pb-4">
                            <div className="flex-1 h-[2px] bg-[#e8e3db] rounded-full overflow-hidden">
                              <motion.div key={`${i}-bar`} className="h-full rounded-full" style={{ background: '#ff7518', transformOrigin: 'left' }}
                                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }} />
                            </div>
                            <Link href="/services" className="inline-flex items-center gap-1.5 text-accent font-bold text-[12px] shrink-0 group/cta" onClick={(e) => e.stopPropagation()}>
                              Learn more <ArrowRight className="w-3 h-3 transition-transform group-hover/cta:translate-x-0.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            <div className="hidden lg:block lg:col-span-3 relative rounded-[22px] overflow-hidden bg-[#ede9e3] lg:min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.img key={activeService} src={SERVICES[activeService].img} alt={SERVICES[activeService].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] }} />
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span key={`ghost-${activeService}`} className="absolute top-5 right-6 font-black leading-none pointer-events-none select-none"
                  style={{ fontSize: 'clamp(4rem, 6vw, 6.5rem)', color: 'rgba(255,255,255,0.10)', letterSpacing: '-4px' }}
                  initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}>
                  {String(activeService + 1).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 right-0 px-7 pt-16 pb-7"
                style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.84) 0%, rgba(7,30,54,0.28) 55%, transparent 85%)' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={activeService} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }} className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-black uppercase tracking-[2.5px] mb-1.5" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)' }}>
                        {String(activeService + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
                      </p>
                      <p className="text-white font-black text-[22px] tracking-[-0.5px] leading-tight">{SERVICES[activeService].title}</p>
                    </div>
                    <Link href="/booking" className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-[12px] pointer-events-auto transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                      style={{ background: '#ff7518', color: '#fff' }}>
                      Book now <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center gap-1.5 mt-4">
                  {SERVICES.map((_, i) => (
                    <button key={i} onClick={() => selectService(i)} className="transition-all duration-300 rounded-full cursor-pointer"
                      style={{ width: i === activeService ? '20px' : '6px', height: '6px', background: i === activeService ? '#ff7518' : 'rgba(255,255,255,0.30)' }}
                      aria-label={`View ${SERVICES[i].title}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          DONATE CTA
      ══════════════════════════════════ */}
      <Reveal direction="up">
        <section className="py-8 sm:py-10 lg:py-14">
          <div className={WRAP}>
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[28px]" style={{ minHeight: '440px' }}
              onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <motion.img src={DONATE_IMG} alt="" className="absolute inset-0 w-full h-full object-cover"
                animate={{ opacity: isHovered ? 0 : 1 }} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} />
              <motion.img src="https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246029/0B2A0279_1_drz6kf.webp" alt=""
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 1.02 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], opacity: { duration: 0.7 }, scale: { duration: 0.9, ease: [0.32, 0, 0.67, 0] } }} />
              <motion.div className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgba(7,30,54,0.02) 0%, rgba(7,30,54,0.35) 45%, rgba(7,30,54,0.65) 100%)' }}
                animate={{ background: isHovered ? 'linear-gradient(to right, rgba(7,30,54,0.06) 0%, rgba(7,30,54,0.45) 45%, rgba(7,30,54,0.75) 100%)' : 'linear-gradient(to right, rgba(7,30,54,0.02) 0%, rgba(7,30,54,0.35) 45%, rgba(7,30,54,0.65) 100%)' }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} />
              <div className="relative z-10 flex items-center justify-end min-h-[440px]">
                <div className="max-w-[460px] p-10 sm:p-12 lg:p-16">
                  <motion.p className="font-black uppercase tracking-[3px] mb-4" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.32)' }}
                    animate={{ opacity: isHovered ? 0.7 : 1 }} transition={{ duration: 0.5 }}>Make a Difference</motion.p>
                  <h2 className="font-black text-white leading-[1.2] tracking-[-1px] mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                    Give a Child Their{' '}
                    <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>First Smile</em>
                  </h2>
                  <motion.p className="text-[12px] leading-[1.7] mb-7 font-light" style={{ color: 'rgba(255,255,255,0.50)' }}
                    animate={{ opacity: isHovered ? 0.85 : 1 }} transition={{ duration: 0.5 }}>
                    Your generosity brings life-changing cleft care to those who need it most.
                  </motion.p>
                  <motion.button onClick={openModal}
                    className="inline-flex items-center gap-2 bg-white text-accent font-black text-[13px] px-7 py-3.5 rounded-full hover:bg-accent hover:text-white transition-all duration-200 shadow-xl hover:-translate-y-px"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Donate Now <Heart className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  )
}

/* ── Transformation section (own component so useInView ref is scoped) ── */
function TransformSection({ currentPatientIndex, setCurrentPatientIndex, currentPatient }: {
  currentPatientIndex: number
  setCurrentPatientIndex: (i: number) => void
  currentPatient: typeof PATIENT_GALLERY[0]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: false, amount: 0.3 })

  return (
    <section ref={sectionRef} className="py-20 xl:py-28 bg-[#fdfcfb]">
      <div className={WRAP}>

        {/* Heading row */}
        <Reveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="font-black tracking-[3.5px] uppercase mb-3" style={{ fontSize: '10px', color: '#ff7518' }}>
                Before &amp; After
              </p>
              <h2
                className="font-black leading-[1.0] text-body"
                style={{ fontSize: 'clamp(2rem, 3.8vw, 3.4rem)', letterSpacing: '-1.5px' }}
              >
                Witness the{' '}
                <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                  Transformations
                </em>
              </h2>
            </div>
            <p className="text-[14px] font-medium leading-snug sm:text-right sm:max-w-[220px]" style={{ color: '#8a96a8' }}>
              Drag the slider to reveal every life-changing result.
            </p>
          </div>
        </Reveal>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-stretch">

          {/* ── Slider (65%) ── */}
          <div className="w-full md:w-[65%]" style={{ minHeight: 'clamp(320px, 48vw, 620px)' }}>
            <ImageComparisonSlider
              images={PATIENT_GALLERY}
              currentIndex={currentPatientIndex}
              onIndexChange={setCurrentPatientIndex}
              autoPlayInterval={40000}
              className="w-full h-full"
              showControls={false}
              scrollReveal={inView}
            />
          </div>

          {/* ── Info panel (35%) ── */}
          <div className="w-full md:w-[35%] flex flex-col bg-white rounded-[20px] shadow-[0_4px_24px_rgba(7,30,54,0.08)] overflow-hidden">

            {/* Top: patient details */}
            <div className="flex-1 px-7 pt-7 pb-5">
              <p className="font-black uppercase tracking-[2.5px] mb-5" style={{ fontSize: '9px', color: 'rgba(255,117,24,0.7)' }}>
                Patient Story
              </p>

              {/* Name */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPatientIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p
                    className="font-black text-[#071e36] leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2rem)', letterSpacing: '-1px' }}
                  >
                    {currentPatient.patientName}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {currentPatient.age && (
                      <span className="font-black tracking-[2px] uppercase text-accent" style={{ fontSize: '9px' }}>
                        {currentPatient.age}
                      </span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-accent/30" />
                    <span className="font-black tracking-[2px] uppercase" style={{ fontSize: '9px', color: '#8a96a8' }}>
                      {currentPatient.condition}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#d0d8e4]" />
                    <span className="font-black tracking-[2px] uppercase" style={{ fontSize: '9px', color: '#8a96a8' }}>
                      {currentPatient.location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Divider */}
              <div className="w-full h-px mt-6 mb-6" style={{ background: '#f0f3f7' }} />

              {/* Drag hint */}
              <p className="text-[12px] leading-[1.7]" style={{ color: '#a0acbc' }}>
                Drag the divider left or right to compare the patient&apos;s journey — before and after care at BMC.
              </p>
            </div>

            {/* Bottom: navigation + CTA */}
            <div className="px-7 pb-7 pt-2">
              {/* Numbered patient nav */}
              <div className="flex items-center gap-2 mb-5">
                {PATIENT_GALLERY.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPatientIndex(idx)}
                    className="transition-all duration-200 rounded-full font-black flex items-center justify-center"
                    style={{
                      width: idx === currentPatientIndex ? '32px' : '28px',
                      height: '28px',
                      fontSize: '10px',
                      background: idx === currentPatientIndex ? '#ff7518' : 'rgba(7,30,54,0.07)',
                      color: idx === currentPatientIndex ? '#ffffff' : 'rgba(7,30,54,0.35)',
                    }}
                    aria-label={`Patient ${idx + 1}`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>

              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-[#071e36] text-white font-black text-[12px] px-5 py-3 rounded-full hover:bg-[#0d2d52] transition-colors tracking-[0.2px]"
              >
                View all stories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

