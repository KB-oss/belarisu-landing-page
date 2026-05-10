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
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246801/backk_ob1gnv.webp',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777995839/MM9_ar0km0.webp',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778247125/backkk_ztmkzm.webp',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777995798/YY4_2_of9xhh.webp',
  'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246556/ChatGPT_Image_May_8_2026_04_19_15_PM_bafnwv.webp'
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
    img: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778179639/orthodontics-home_zzxjvc.jpg',
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
  const inView = useInView(ref, { once: true, amount: 0.6 })
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
                Over 600 families.{' '}
                <em style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: '#ff7518' }}>
                  Not a single bill.
                </em>
              </h2>
              <p
                className="mt-5 mx-auto leading-relaxed"
                style={{ fontSize: '16px', color: 'rgba(255,255,255,0.40)', maxWidth: '460px' }}
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
                  className="font-black leading-none mb-5"
                  style={{ fontSize: 'clamp(4rem, 7vw, 7.5rem)', letterSpacing: '-5px', color: '#ffffff' }}
                >
                  <StatNumber target={num} suffix="" />
                  <span style={{ color: '#ff7518' }}>{suffix}</span>
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
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.30)', maxWidth: '210px' }}
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
      <section className="py-24 xl:py-32">
        <div className={WRAP}>

          <Reveal direction="up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
              <div>
                <p
                  className="font-black leading-[1.0] text-body"
                  style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', letterSpacing: '-2px' }}
                >
                  Witness the
                </p>
                <p
                  className="font-black leading-[1.0] text-accent"
                  style={{
                    fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
                    letterSpacing: '-1.5px',
                    fontFamily: PLAYFAIR,
                    fontStyle: 'italic',
                  }}
                >
                  Transformations
                </p>
              </div>
              <p
                className="font-semibold italic leading-snug tracking-[-0.3px] md:text-right md:pb-1"
                style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', color: '#8a96a8', maxWidth: '260px' }}
              >
                That happen every{' '}
                <em className="not-italic font-black text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                  day
                </em>
              </p>
            </div>
          </Reveal>

          {/* Slider */}
          <Reveal direction="up" delay={0.08}>
            <div
              className="relative w-full rounded-[20px] overflow-hidden"
              style={{ height: 'clamp(360px, 52vw, 660px)' }}
            >
              <ImageComparisonSlider
                images={PATIENT_GALLERY}
                currentIndex={currentPatientIndex}
                onIndexChange={setCurrentPatientIndex}
                autoPlayInterval={40000} // 40 seconds
                className="w-full h-full"
              />

              {/* Patient overlay - now dynamic */}
              <div
                className="absolute bottom-0 left-0 right-0 px-8 sm:px-12 py-8 pointer-events-none z-20"
                style={{
                  background: 'linear-gradient(to top, rgba(7,30,54,0.92) 0%, rgba(7,30,54,0.30) 55%, transparent 100%)',
                }}
              >
                <p
                  className="text-white font-black mb-3 leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', letterSpacing: '-1.5px' }}
                >
                  {currentPatient.patientName}
                </p>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {currentPatient.age && (
                    <>
                      <span className="font-black tracking-[2.5px] uppercase text-accent" style={{ fontSize: '10px' }}>
                        {currentPatient.age}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-accent/40" />
                    </>
                  )}
                  <span className="font-black tracking-[2.5px] uppercase" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>
                    {currentPatient.condition}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-black tracking-[2.5px] uppercase" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.38)' }}>
                    {currentPatient.location}
                  </span>
                </div>
              </div>

              {/* View all button */}
              <div className="absolute bottom-5 right-5 pointer-events-auto z-30">
                <Link
                  href="/gallery"
                  className="flex items-center gap-1.5 bg-white/92 hover:bg-white backdrop-blur-sm text-navy text-[12px] font-black px-5 py-3 rounded-[10px] transition-all shadow-lg hover:-translate-y-px tracking-[0.2px]"
                >
                  View all transformations <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          SERVICES
      ══════════════════════════════════ */}
      <section className="py-24 xl:py-28 bg-[#fdfcfb]">
        <div className={WRAP}>

          <Reveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-20 items-end mb-14">
              <div>
                <p className="font-black tracking-[3.5px] uppercase mb-4" style={{ fontSize: '10px', color: '#ff7518' }}>
                  Our Services
                </p>
                <h2
                  className="font-black leading-[1.06] tracking-[-1.5px] text-body"
                  style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)' }}
                >
                  Get to know our{' '}
                  <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                    comprehensive care
                  </em>
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-muted text-[15px] leading-[1.85]">
                  Our multidisciplinary team addresses every dimension of cleft care — restoring health, function, and confidence across every stage of life.
                </p>
                <Link
                  href="/services"
                  className="self-start inline-flex items-center gap-2 text-accent font-bold text-[13px] group transition-all"
                >
                  View all services
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Accordion + image */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-10 items-stretch">

            {/* ── Accordion list ── */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              {SERVICES.map((svc, i) => {
                const isActive = i === activeService
                return (
                  <motion.div
                    key={svc.title}
                    className="rounded-[16px] cursor-pointer overflow-hidden transition-colors duration-200"
                    style={{
                      background: isActive ? '#fff' : 'transparent',
                      boxShadow: isActive ? '0 2px 16px rgba(7,30,54,0.07), 0 0 0 1px rgba(7,30,54,0.06)' : 'none',
                    }}
                    onClick={() => selectService(i)}
                    layout
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  >
                    {/* Row header */}
                    <div className="flex items-center gap-3 px-4 py-4 select-none">
                      {/* Icon bubble */}
                      <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-250"
                        style={{
                          background: isActive ? 'rgba(255,117,24,0.10)' : '#eae6e0',
                          color: isActive ? '#ff7518' : '#8a939f',
                        }}
                      >
                        {svc.icon}
                      </div>

                      {/* Title + number */}
                      <div className="flex-1 min-w-0">
                        <span
                          className="font-bold text-[14.5px] transition-colors duration-200 block"
                          style={{ color: isActive ? '#071e36' : '#62748e' }}
                        >
                          {svc.title}
                        </span>
                      </div>

                      {/* Number badge */}
                      <span
                        className="font-black tabular-nums shrink-0 transition-colors duration-200"
                        style={{ fontSize: '10px', color: isActive ? '#ff7518' : 'rgba(7,30,54,0.15)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Chevron */}
                      <motion.svg
                        viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: isActive ? '#ff7518' : '#c4ccd4' }}
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                      >
                        <path d="M3 6l5 5 5-5" />
                      </motion.svg>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                          className="overflow-hidden"
                        >
                          {/* Mobile-only image thumbnail */}
                          <div className="lg:hidden mx-4 mb-3 rounded-[12px] overflow-hidden h-[180px] bg-[#ede9e3]">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeService}
                                src={svc.img}
                                alt={svc.title}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.04 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                              />
                            </AnimatePresence>
                          </div>

                          <p className="text-muted text-[13.5px] leading-[1.78] px-4 pb-3">{svc.desc}</p>

                          {/* Progress bar + CTA row */}
                          <div className="flex items-center justify-between gap-4 px-4 pb-4">
                            {/* Auto-advance progress */}
                            <div className="flex-1 h-[2px] bg-[#e8e3db] rounded-full overflow-hidden">
                              <motion.div
                                key={`${i}-bar`}
                                className="h-full rounded-full"
                                style={{ background: '#ff7518', transformOrigin: 'left' }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                              />
                            </div>
                            {/* Learn more CTA */}
                            <Link
                              href="/services"
                              className="inline-flex items-center gap-1.5 text-accent font-bold text-[12px] shrink-0 group/cta"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Learn more
                              <ArrowRight className="w-3 h-3 transition-transform group-hover/cta:translate-x-0.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* ── Image panel (desktop) ── */}
            <div className="hidden lg:block lg:col-span-3 relative rounded-[22px] overflow-hidden bg-[#ede9e3] lg:min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeService}
                  src={SERVICES[activeService].img}
                  alt={SERVICES[activeService].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                />
              </AnimatePresence>

              {/* Ghost number watermark */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`ghost-${activeService}`}
                  className="absolute top-5 right-6 font-black leading-none pointer-events-none select-none"
                  style={{ fontSize: 'clamp(4rem, 6vw, 6.5rem)', color: 'rgba(255,255,255,0.10)', letterSpacing: '-4px' }}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                >
                  {String(activeService + 1).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>

              {/* Bottom gradient + label */}
              <div
                className="absolute bottom-0 left-0 right-0 px-7 pt-16 pb-7"
                style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.84) 0%, rgba(7,30,54,0.28) 55%, transparent 85%)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className="flex items-end justify-between gap-4"
                  >
                    <div>
                      <p
                        className="font-black uppercase tracking-[2.5px] mb-1.5"
                        style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)' }}
                      >
                        {String(activeService + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
                      </p>
                      <p className="text-white font-black text-[22px] tracking-[-0.5px] leading-tight">
                        {SERVICES[activeService].title}
                      </p>
                    </div>
                    {/* Book now button */}
                    <Link
                      href="/booking"
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-[12px] pointer-events-auto transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                      style={{ background: '#ff7518', color: '#fff' }}
                    >
                      Book now
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5 mt-4">
                  {SERVICES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => selectService(i)}
                      className="transition-all duration-300 rounded-full cursor-pointer"
                      style={{
                        width: i === activeService ? '20px' : '6px',
                        height: '6px',
                        background: i === activeService ? '#ff7518' : 'rgba(255,255,255,0.30)',
                      }}
                      aria-label={`View ${SERVICES[i].title}`}
                    />
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
            <div
              className="relative overflow-hidden rounded-[24px] sm:rounded-[28px]"
              style={{ minHeight: '440px' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Both images rendered simultaneously for smoother crossfade */}
              <motion.img
                src={DONATE_IMG}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                animate={{ opacity: isHovered ? 0 : 1 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              />

              <motion.img
                src="https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246029/0B2A0279_1_drz6kf.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 1.02
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.25, 0.1, 0.25, 1],
                  opacity: { duration: 0.7 },
                  scale: { duration: 0.9, ease: [0.32, 0, 0.67, 0] }
                }}
              />

              {/* Gradient Overlay with subtle hover enhancement */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(7,30,54,0.02) 0%, rgba(7,30,54,0.35) 45%, rgba(7,30,54,0.65) 100%)',
                }}
                animate={{
                  background: isHovered
                    ? 'linear-gradient(to right, rgba(7,30,54,0.06) 0%, rgba(7,30,54,0.45) 45%, rgba(7,30,54,0.75) 100%)'
                    : 'linear-gradient(to right, rgba(7,30,54,0.02) 0%, rgba(7,30,54,0.35) 45%, rgba(7,30,54,0.65) 100%)'
                }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              />

              <div className="relative z-10 flex items-center justify-end min-h-[440px]">
                <div className="max-w-[460px] p-10 sm:p-12 lg:p-16">
                  <motion.p
                    className="font-black uppercase tracking-[3px] mb-4"
                    style={{ fontSize: '8px', color: 'rgba(255,255,255,0.32)' }}
                    animate={{ opacity: isHovered ? 0.7 : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Make a Difference
                  </motion.p>
                  <h2
                    className="font-black text-white leading-[1.2] tracking-[-1px] mb-4"
                    style={{ fontSize: 'clamp(0.9rem, 3vw, 2.5rem)' }}
                  >
                    Give a Child Their{' '}
                    <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                      First Smile
                    </em>
                  </h2>
                  <motion.p
                    className="text-[12px] leading-[1.7] mb-7 font-light"
                    style={{ color: 'rgba(255,255,255,0.50)' }}
                    animate={{ opacity: isHovered ? 0.85 : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Your generosity brings life-changing cleft care to those who need it most.
                  </motion.p>
                  <motion.button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 bg-white text-accent font-black text-[11px] px-6 py-3 rounded-full hover:bg-accent hover:text-white transition-all duration-200 shadow-xl hover:-translate-y-px"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Donate Now <Heart className='w-4 h-4' />
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
