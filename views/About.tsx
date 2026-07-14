'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Reveal from '../components/Reveal'
import { useDonation } from '../context/DonationContext'
import {
  Stethoscope,
  HeartHandshake,
  LucideProps,
  Heart,
  Users,
  Award,
  Quote
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-is-mobile'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Figma assets ─── */
const IMG_HERO = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999410/1H4A3138_rpk5lr.jpg'
const IMG_STORY_L = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001795/ChatGPT_Image_May_5_2026_08_22_29_PM_lpuepj.png'
const IMG_STORY_SECTION = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999411/1H4A3088_enrccn.jpg'
const IMG_FULL = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999413/IMG_0019_id2y16.jpg'
const IMG_CARE_A = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997868/Care_That_grows_with_you_1_vugnlh.jpg'
const IMG_CARE_B = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997867/Care_That_grows_with_you_2JPG_wmezgb.jpg'
const IMG_CARE_C = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997868/Care_That_grows_with_you_3_ufwofk.jpg'
const IMG_SPLIT_L = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999411/IMG_0011_raryur.jpg'
const IMG_SPLIT_R = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999418/1H4A5074_eymfxz.jpg'
const DONATE_IMG_DESKTOP = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246027/Brighton_Chacha_Marwa_4yrs_1_z0tcog.webp'
const DONATE_IMG_DESKTOP_HOVER = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246028/Brighton_Chacha_Marwa_4yrs._1_apmux6.webp'
const DONATE_IMG_MOBILE = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/v1783886277/x0if6pujpuuns9xozafr_mgrz57.webp'
const DONATE_IMG_MOBILE_HOVER = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/v1783886289/gjljrcyxblexcge7a3uk_qbxd3f.webp'

const IMG_QUOTE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778182124/every_smile_1_p8yhro.jpg'
const IMG_CARE_1 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001798/ChatGPT_Image_May_5_2026_08_22_15_PM_hvd3dp.png'
const IMG_CARE_2 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778538133/ChatGPT_Image_May_12_2026_01_17_08_AM_hipp6k.png'
const IMG_CARE_3 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778538097/ChatGPT_Image_May_12_2026_01_16_54_AM_bqunnt.png'
const IMG_SPLIT_4 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778538055/ChatGPT_Image_May_12_2026_01_20_38_AM_fzvg5z.png'
const IMG_SPLIT_5 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778538061/ChatGPT_Image_May_12_2026_01_20_29_AM_sdg7oh.png'

/* ─── Data ─── */
const CCC_ITEMS: string[] = [
  'Surgical repair of cleft lip and cleft palate',
  'Orthodontic and dental care to support healthy facial and dental development',
  'Speech and language therapy to help patients communicate clearly',
  'Nutritional rehabilitation and feeding support for healthy growth',
  'Psychosocial counseling for patients and families',
  'Ear, Nose, and Throat (ENT) care to support hearing and breathing',
  'Long-term follow-up care throughout the care journey',
]

interface SdgCard {
  color: string
  goal: string
  title: string
  text: string
}

const SDG_CARDS: SdgCard[] = [
  {
    color: '#4d9f38',
    goal: 'SDG 3',
    title: 'Good Health & Well-Being',
    text: 'Ensuring healthy lives and promoting well-being by providing life-changing surgical and long-term care.',
  },
  {
    color: '#c5192e',
    goal: 'SDG 4',
    title: 'Quality Education',
    text: 'Helping children with cleft conditions overcome speech barriers and stigma that can otherwise prevent school attendance.',
  },
  {
    color: '#dc1367',
    goal: 'SDG 10',
    title: 'Reduced Inequalities',
    text: 'Providing free access to specialized care for children and families who might otherwise be unable to afford treatment.',
  },
  {
    color: '#19486a',
    goal: 'SDG 17',
    title: 'Partnerships for the Goals',
    text: 'Working with local and international partners to expand access to comprehensive cleft care.',
  },
  {
    color: '#a31942',
    goal: 'SDG 8',
    title: 'Decent Work & Economic Growth',
    text: 'Supporting long-term social and economic participation by helping patients pursue education and employment.',
  },
]

interface ServiceCard {
  icon: React.ComponentType<LucideProps>;
  title: string
  sub: string
}

const SERVICES_CARDS: ServiceCard[] = [
  { icon: Stethoscope, title: 'Cleft Surgery', sub: 'Primary and secondary surgical repair.' },
  { icon: Heart, title: 'Orthodontics', sub: 'Long-term dental alignment correction.' },
  { icon: Users, title: 'Speech Therapy', sub: 'Support for communication development.' },
  { icon: Award, title: 'Nutrition', sub: 'Pre and post-operative feeding support.' },
  { icon: HeartHandshake, title: 'Psychosocial', sub: 'Emotional and counseling support.' },
];


interface SocialLinks {
  linkedin: string | null
  twitter: string | null
  instagram: string | null
}

interface TeamMember {
  name: string
  credentials?: string
  role: string
  dept: string
  img: string
  bio: string
  social: SocialLinks
}

const TEAM: TeamMember[] = [
  {
    name: 'Sesnie Z. Barnabas',
    role: 'Chief Executive Officer',
    dept: 'Leadership',
    img: IMG_CARE_1,
    bio: 'Sesnie Z. Barnabas is a senior health and development leader with 18 years of experience advancing programs across Africa. She has led multi-country strategic initiatives, built partnerships with governments and global donors, and strengthened institutions delivering care within complex health systems. At BelaRisu Medical Center, she leads the organization\'s strategic vision and operational growth, working to expand access to comprehensive cleft care and strengthen sustainable systems that improve outcomes for children and families born with cleft conditions.',
    social: { linkedin: 'https://www.linkedin.com/in/sesnie-zemichael-barnabas-68a783a', twitter: null, instagram: null },
  },
  {
    name: 'Martin W. Kamau',
    credentials: 'BDS, MDS (OMFS), FAOCMF',
    role: 'Co-Founder and Lead Surgeon',
    dept: 'Clinical',
    img: IMG_CARE_2,
    bio: 'Martin W. Kamau is the co-founder and Lead Surgeon at BelaRisu Medical Centre, with over a decade of experience in Dental and Oral-Maxillofacial Surgery. His extensive field experience across the continent has been instrumental in shaping the Centre\'s establishment, its life-changing cleft care programs, and the development of the training hub that equips the next generation of surgical professionals. He has pioneered innovative cleft care initiatives by combining local expertise with global standards, and his visionary leadership in surgical care continues to drive BelaRisu\'s mission to deliver high-quality, equitable, and patient-centered care.',
    social: { linkedin: 'https://www.linkedin.com/in/martin-kamau-15a2454a', twitter: null, instagram: null },
  },
  {
    name: 'Abdulhakim Kimani',
    role: 'Co-Founder and Chief Operating Officer',
    dept: 'Leadership',
    img: IMG_CARE_3,
    bio: 'Abdulhakim Kimani is the visionary co-founder of BelaRisu Medical Centre, playing an instrumental role in establishing the Centre, shaping its mission, and stewarding it into the beacon of hope it is today. As Chief Operating Officer, he oversees day-to-day operations and drives interdisciplinary initiatives that strengthen patient-centered programs. An avid field team leader, he further advances the Centre\'s mission across the continent through its Foundation arm, bringing hands-on leadership to programs on the ground. Abdulhakim is also an accomplished humanitarian photographer, using visual storytelling to connect the wider public with the Centre and the children and families it serves.',
    social: { linkedin: null, twitter: null, instagram: null },
  },
  {
    name: 'Rose Maket',
    role: 'Chief Growth Officer',
    dept: 'Leadership',
    img: IMG_SPLIT_4,
    bio: 'Rose Maket is a strategic growth leader with over 20 years of experience across the private sector, social enterprises, and start-ups. She specializes in driving organizational growth through strategic partnerships, revenue generation, operational excellence, and the development of high-performing teams. Rose has held senior leadership roles across multiple industries, including retail, oil and gas, renewable energy, tourism, academia, agribusiness, and the non-profit sector, working across Kenya, Ghana, and Zambia. At BelaRisu Medical Center, she focuses on expanding partnerships and strengthening sustainable financing to support the organization\'s growth and the delivery of life-changing surgical care. Rose also serves on the boards of Alive and Kicking Kenya and Savannah Hospital.',
    social: { linkedin: 'https://www.linkedin.com/in/rosemaket', twitter: null, instagram: null },
  },
  {
    name: 'Eleleta Surafel',
    credentials: 'MD, MPH',
    role: 'Chief of Staff',
    dept: 'Leadership',
    img: IMG_SPLIT_5,
    bio: 'Eleleta Surafel is a public health professional with expertise in health systems strengthening and equity-focused programming. At BelaRisu Medical Centre, she supports leadership in advancing strategic initiatives, strengthening partnerships, and designing systems that expand access to surgical care for children and families affected by cleft conditions. Eleleta has led and supported initiatives with global and regional institutions including Women in Global Health, Africa CDC, and UNFPA, and serves as an Advisory Council Member at Amref Health Africa in Ethiopia. As a young member of the management team, her role reflects the Centre\'s commitment to cultivating the next generation of health leaders.',
    social: { linkedin: 'https://www.linkedin.com/in/eleletamd', twitter: null, instagram: null },
  },
  {
    name: 'Lynnah Temba',
    role: 'Program Manager',
    dept: 'Operations',
    img: IMG_STORY_L,
    bio: 'Since the very first day Bela Risu Medical Center opened its doors, Lynnah has been one of the welcoming faces at the heart of our patient journey. Beginning her career with us as an Administrative Associate and now serving as Program Manager, she has played a central role in coordinating the many moving parts that ensure patients and families are supported through their journey with us.',
    social: { linkedin: null, twitter: null, instagram: null },
  },
]


/* ─── Hero stagger ─── */
const heroStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }
const heroItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

/* ─── Label pill ─── */
interface LabelProps {
  children: React.ReactNode
}

function Label({ children }: LabelProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
      style={{ background: 'rgba(255,117,24,0.12)' }}
    >
      <span className="w-3.5 h-3.5 rounded-full bg-accent shrink-0" />
      <span className="font-black tracking-[1px] uppercase text-accent" style={{ fontSize: '11px' }}>
        {children}
      </span>
    </div>
  )
}

/* ─── Social link ─── */
interface SocialLinkProps {
  href: string | null
  label: string
  children: React.ReactNode
}

function SocialLink({ href, label, children }: SocialLinkProps) {
  if (!href) return null
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
      style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,117,24,0.25)'; e.currentTarget.style.color = '#ff7518' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
    >
      {children}
    </a>
  )
}

/* ═══════════════════════════════════════ */
export default function About() {
  const { openModal } = useDonation()
  const isMobile = useIsMobile(425) // 768px is the standard mobile breakpoint
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isHovered, setIsHovered] = useState(false);
  const DONATE_IMGS = isMobile ? DONATE_IMG_MOBILE : DONATE_IMG_DESKTOP
  const DONATE_IMGS_HOVER = isMobile ? DONATE_IMG_MOBILE_HOVER : DONATE_IMG_DESKTOP_HOVER

  /* Lightbox: lock scroll + close on Escape */
  useEffect(() => {
    if (!selectedMember) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedMember(null) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selectedMember])

  return (
    <div className="pt-[88px]" style={{ background: '#f4f4f4', overflowX: 'clip' }}>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <div className={`${WRAP} pt-12 pb-14`}>
        <motion.div
          className="text-center mb-10"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={heroItem}
            className="font-black leading-[1.0] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', color: '#071e36' }}
          >
            Driven by Care.
          </motion.h1>
          <motion.h1
            variants={heroItem}
            className="font-black leading-[1.0] tracking-[-0.04em] mb-7"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 6rem)',
              color: '#ff7518',
              fontFamily: PLAYFAIR,
              fontStyle: 'italic',
            }}
          >
            Defined by Impact.
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="font-light leading-snug max-w-[600px] mx-auto"
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#45556c' }}
          >
            We are a dedicated team of medical professionals delivering high-quality cleft care across every stage of life
          </motion.p>
        </motion.div>

        <Reveal direction="up" delay={0.1}>
          <div className="w-full rounded-[24px] overflow-hidden" style={{ height: 'clamp(320px, 55vw, 848px)' }}>
            <img src={IMG_HERO} alt="BelaRisu Medical Centre team" className="w-full h-full object-cover" />
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          OUR STORY
      ══════════════════════════════════ */}
      <div className={`${WRAP} py-14 xl:py-20`}>
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-stretch">

          <Reveal direction="up" className="lg:w-[340px] xl:w-[380px] shrink-0 self-stretch">
            <div className="rounded-[16px] overflow-hidden h-full" style={{ minHeight: '480px' }}>
              <img src={IMG_STORY_SECTION} alt="Our story" className="w-full h-full object-cover" />
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.08}>
            <div className="flex flex-col gap-7">
              <Label>Our Story</Label>
              <h2
                className="font-black leading-[1.1] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', color: '#071e36' }}
              >
                Care That Grows With{' '}
                <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>You</em>
              </h2>
              <div className="space-y-4 leading-[1.85]" style={{ fontSize: '16px', color: '#696969' }}>
                <p>Just as smiles grow with us through life, so too does our journey with every patient we serve.</p>
                <p>
                  BelaRisu Medical Centre (BMC) was established in <strong style={{ color: '#071e36' }}>2022</strong> as the flagship institution of Bela Risu Foundation, with a mission to ensure that children and adults born with cleft lip and cleft palate can access the holistic care they need to live healthy, confident lives.
                </p>
                <p>
                  At BMC, we provide free, multidisciplinary cleft care, bringing together highly specialized services under one roof. Our approach recognizes that treating cleft conditions requires far more than surgery alone. Patients and families receive coordinated care from a team of surgeons, orthodontists, speech therapists, psychologists, and nutrition specialists to support healing, development, and long-term wellbeing.
                </p>
                <p>
                  Our centre stands as a <strong style={{ color: '#071e36' }}>state-of-the-art, fully equipped 30-bed medical facility</strong> with two operating theaters, designed to deliver high-quality surgical care, and support the full rehabilitation journey of every patient.
                </p>
                <p style={{ color: '#071e36' }}>
                  Restoring a smile is only the beginning.<br />
                  The true art of our work is in helping our patients reclaim their voice, their confidence, and their place in the world.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* ══════════════════════════════════
          FULL-WIDTH IMAGE
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-14 xl:pb-20`}>
        <Reveal direction="up">
          <div className="w-full rounded-[16px] overflow-hidden" style={{ height: 'clamp(260px, 35vw, 546px)' }}>
            <img src={IMG_FULL} alt="" className="w-full h-full object-cover" />
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          OUR CARE MODEL
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-14 xl:pb-20`}>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 xl:gap-14 items-start">

          <Reveal direction="up">
            <div className="flex flex-col gap-4">
              <Label>Our Care Model</Label>
              <h2
                className="font-black leading-[1.1] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.1rem)', color: '#071e36' }}
              >
                Care That Grows With{' '}
                <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>You</em>
              </h2>
              <div className="leading-[1.85] space-y-3" style={{ fontSize: '16px', color: '#696969' }}>
                <p>Cleft care is more than a single surgery. It is a journey that unfolds over time.</p>
                <p>
                  At BMC, we follow a Comprehensive Cleft Care (CCC) model — a multidisciplinary approach that supports patients from infancy through adulthood, addressing the medical aspects of cleft conditions, as well as the developmental and emotional challenges that can come with them.
                </p>
                <p>Through coordinated care, our team works together to ensure that every patient can eat, speak, grow, and socialize with confidence.</p>
              </div>

              <div style={{ fontSize: '16px', color: '#696969' }}>
                <p className="mb-2">Our CCC model includes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {CCC_ITEMS.map((item) => (
                    <li key={item} className="leading-[1.75]" style={{ fontSize: '16px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <p style={{ fontSize: '16px', color: '#696969' }}>
                By bringing these services together under one roof, we ensure that patients receive the continuous, coordinated care they need to thrive.
              </p>

              <div className="mt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-white font-black text-[14px] px-7 py-3.5 rounded-full transition-all duration-200 hover:opacity-90"
                  style={{ background: '#071e36' }}
                >
                  Explore Our Services
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <div className="grid grid-cols-2 gap-[19px]" style={{ minHeight: '440px' }}>
              <div className="rounded-[16px] overflow-hidden bg-[#ede9e3]" style={{ minHeight: '200px' }}>
                <img src={IMG_CARE_A} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-[16px] overflow-hidden bg-[#ede9e3]" style={{ minHeight: '200px' }}>
                <img src={IMG_CARE_B} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="col-span-2 rounded-[16px] overflow-hidden bg-[#ede9e3]" style={{ minHeight: '180px' }}>
                <img src={IMG_CARE_C} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* ══════════════════════════════════
          TWO IMAGES SIDE BY SIDE
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-14 xl:pb-20`}>
        <Reveal direction="up">
          <div className="flex gap-6" style={{ height: 'clamp(280px, 42vw, 650px)' }}>
            <div className="rounded-[16px] overflow-hidden bg-[#ede9e3]" style={{ flex: '0 0 68%' }}>
              <img src={IMG_SPLIT_L} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-[16px] overflow-hidden bg-[#ede9e3] flex-1">
              <img src={IMG_SPLIT_R} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          GLOBAL IMPACT — SDG cards
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-14 xl:pb-20`}>
        <Reveal direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16 mb-10">
            <div className="flex-1">
              <Label>Our Global Impact</Label>
              <h2
                className="font-black leading-[1.1] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.75rem)', color: '#071e36' }}
              >
                Care that Contributes to{' '}
                <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>Global Goals</em>
              </h2>
            </div>
            <p className="lg:max-w-[380px] leading-[1.8] lg:pb-1 shrink-0" style={{ fontSize: '15px', color: '#696969' }}>
              Our work directly aligns with the United Nations Sustainable Development Goals, helping patients reclaim health, education, and opportunity.
            </p>
          </div>
        </Reveal>

        {/* SDG tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SDG_CARDS.map(({ color, goal, title, text }, i) => {
            const num = goal.replace('SDG ', '')
            return (
              <motion.div
                key={goal}
                className="flex flex-col rounded-[20px] overflow-hidden relative"
                style={{ background: color, minHeight: '300px' }}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              >
                {/* Giant number watermark */}
                <div
                  className="absolute bottom-0 right-0 font-black leading-none select-none pointer-events-none"
                  style={{ fontSize: '9rem', color: 'rgba(255,255,255,0.08)', lineHeight: 1, transform: 'translate(12%, 8%)' }}
                >
                  {num}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-5 pt-6">
                  <div className="mb-auto">
                    <div
                      className="inline-flex items-center justify-center rounded-[10px] mb-3"
                      style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.18)' }}
                    >
                      <span className="font-black text-white leading-none" style={{ fontSize: '18px' }}>{num}</span>
                    </div>
                    <p className="font-black uppercase tracking-[2px] mb-1" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
                      {goal}
                    </p>
                    <p className="font-black text-white leading-tight tracking-[-0.3px] mb-3" style={{ fontSize: '14px' }}>
                      {title}
                    </p>
                  </div>
                  <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <p className="text-white/70 leading-[1.65]" style={{ fontSize: '12px' }}>{text}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════
          DONATE CTA
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-14 xl:pb-20`}>
        <Reveal direction="up">
          <div
            className="relative rounded-[24px] overflow-hidden"
            style={{ minHeight: '523px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Default Image */}
            <motion.img
              src={DONATE_IMGS}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Hover Image */}
            <motion.img
              src={DONATE_IMGS_HOVER}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 1.08
              }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                opacity: { duration: 0.7 },
                scale: { duration: 0.9, ease: [0.32, 0, 0.67, 0] }
              }}
            />

            {/* Gradient Overlay with hover enhancement */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(5,5,5,0.0) 20%, rgba(5,5,5,0.45) 52%, rgba(5,5,5,0.82) 100%)'
              }}
              animate={{
                background: isHovered
                  ? 'linear-gradient(to right, rgba(5,5,5,0.1) 20%, rgba(5,5,5,0.55) 52%, rgba(5,5,5,0.88) 100%)'
                  : 'linear-gradient(to right, rgba(5,5,5,0.0) 20%, rgba(5,5,5,0.45) 52%, rgba(5,5,5,0.82) 100%)'
              }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />

            <div className="relative z-10 sm:flex items-center justify-end min-h-[523px]">
              <div className="max-w-[460px] p-10 sm:p-12 xl:p-16 flex flex-col gap-4">
                <motion.p
                  className="font-black uppercase tracking-[3px]"
                  style={{ fontSize: '10px', color: 'rgba(255,255,255,1)' }}
                  animate={{ opacity: isHovered ? 0.7 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Make a Difference
                </motion.p>
                <motion.h2
                  className="font-black text-white leading-[1.2] tracking-[-1px]"
                  style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
                  animate={{ opacity: isHovered ? 0.95 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Give a Child Their{' '}
                  <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>First Smile</em>
                </motion.h2>
                <motion.p
                  className="text-[14px] leading-[1.7] font-light"
                  style={{ color: 'rgba(255,255,255,1)' }}
                  animate={{ opacity: isHovered ? 0.85 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Your generosity brings life-changing care to those who need it most.
                </motion.p>
                <div>
                  <motion.button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 bg-white text-accent font-black text-[13px] px-7 py-3.5 rounded-full hover:bg-accent hover:text-white transition-all duration-200 shadow-xl hover:-translate-y-px"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Donate Now
                    <Heart className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          TEAM
      ══════════════════════════════════ */}
      <div className="pb-14 xl:pb-20">

        <Reveal direction="up">
          <div className={`${WRAP} mb-12`}>
            <Label>Our Experts</Label>
            <h2
              className="font-black leading-[1.1] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', color: '#071e36' }}
            >
              The People Behind{' '}
              <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>Every Smile</em>
            </h2>
          </div>
        </Reveal>

        <div className={`${WRAP} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`}>
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="group relative rounded-[24px] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
              style={{ aspectRatio: '3/4' }}
              onClick={() => setSelectedMember(member)}
            >
              {/* Full-bleed image */}
              <img
                src={member.img}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
              />

              {/* Subtle permanent bottom vignette — always shows name */}
              <div
                className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none transition-opacity duration-400 group-hover:opacity-0"
                style={{ background: 'linear-gradient(to top, rgba(5,20,40,0.80) 0%, transparent 100%)' }}
              />

              {/* Permanent name strip */}
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 z-10 transition-opacity duration-400 group-hover:opacity-0">
                <p className="font-black text-white leading-tight tracking-[-0.3px] mb-0.5" style={{ fontSize: '14px' }}>
                  {member.name}
                </p>
                <p className="font-semibold" style={{ fontSize: '11px', color: '#ff7518' }}>
                  {member.role}
                </p>
              </div>

              {/* Hover overlay — frosted glass sliding up */}
              <div
                className="absolute inset-0 z-20 flex flex-col justify-end px-4 pb-4 pt-8
                  opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-500 ease-out"
                style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.92) 0%, rgba(7,30,54,0.60) 55%, rgba(7,30,54,0.15) 100%)', backdropFilter: 'blur(2px)' }}
              >
                {/* Dept badge */}
                <span
                  className="inline-block self-start px-2.5 py-0.5 rounded-full font-bold uppercase tracking-[1.5px] mb-3"
                  style={{ fontSize: '9px', background: 'rgba(255,117,24,0.22)', color: '#ff7518' }}
                >
                  {member.dept}
                </span>

                {/* Name + role */}
                <p className="font-black text-white text-[14px] leading-tight tracking-[-0.3px] mb-0.5">
                  {member.name}
                </p>
                <p className="font-semibold text-[11px] mb-2.5" style={{ color: '#ff7518' }}>
                  {member.role}
                </p>

                {/* Bio snippet */}
                <p
                  className="text-[11px] leading-[1.6] line-clamp-2 mb-3"
                  style={{ color: 'rgba(255,255,255,0.62)' }}
                >
                  {member.bio}
                </p>

                {/* Social + View Profile CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.8)' }}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <span
                    className="flex items-center gap-1 text-[10px] font-bold"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    View Profile
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          COMPREHENSIVE CARE
      ══════════════════════════════════ */}
      <div style={{ background: '#071e36' }}>
        <div className={`${WRAP} py-14 xl:py-20`}>

          <Reveal direction="up">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(255,117,24,0.15)' }}>
                <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: '#ff7518' }} />
                <span className="font-black tracking-[1px] uppercase" style={{ fontSize: '11px', color: '#ff7518' }}>Our Approach</span>
              </div>
              <h2
                className="font-black leading-[1.1] tracking-[-0.04em] mb-4"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3rem)', color: '#ffffff' }}
              >
                Not a Single Surgery —{' '}
                <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>A Full Journey</em>
              </h2>
              <p className="max-w-[560px] leading-[1.8]" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.52)' }}>
                True cleft care is comprehensive, coordinated, and deeply patient-centred — involving multiple specialists throughout every stage of life.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 xl:gap-14 items-start lg:items-stretch">

            <Reveal direction="up" className="h-full">
              <div className="flex flex-col h-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {SERVICES_CARDS.map(({ icon: Icon, title, sub }, i) => (
                  <motion.div
                    key={title}
                    className="flex items-start gap-5 py-6"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  >
                    <span className="font-black shrink-0 tabular-nums" style={{ fontSize: '13px', color: '#ff7518', paddingTop: '2px', width: '28px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1">
                        <Icon size={17} style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
                        <p className="font-black text-white" style={{ fontSize: '16px' }}>{title}</p>
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.7 }}>{sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1} className="h-full">
              <div
                className="relative rounded-[20px] overflow-hidden h-full"
                style={{ minHeight: '360px' }}
              >
                <img src={IMG_QUOTE_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.92) 0%, rgba(7,30,54,0.25) 50%, transparent 100%)' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-3">
                  <Quote className="w-7 h-7" style={{ color: '#ff7518', transform: 'rotate(180deg)' }} />
                  <p className="text-white font-black leading-[1.35] tracking-[-0.5px]" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)' }}>
                    "Every smile is a reminder of cleft care done right."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.22)' }} />
                    <p className="uppercase tracking-[2px] font-medium whitespace-nowrap" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
                      The BelaRisu Team
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          TEAM MEMBER LIGHTBOX
      ══════════════════════════════════ */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            key="team-lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            style={{ background: 'rgba(7,30,54,0.88)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="relative flex flex-col sm:flex-row w-full max-w-[860px] rounded-[24px] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.97)', maxHeight: '90vh' }}
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="sm:w-[44%] shrink-0 relative"
                style={{ minHeight: '320px', background: '#e0dbd4' }}
              >
                <img
                  src={selectedMember.img}
                  alt={selectedMember.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.55) 0%, transparent 100%)' }}
                />
              </div>

              <div className="flex flex-col gap-5 p-7 sm:p-9 overflow-y-auto">
                <div>
                  <span
                    className="inline-block font-black tracking-[2px] uppercase px-3 py-1.5 rounded-full mb-3"
                    style={{ fontSize: '10px', color: '#ff7518', background: 'rgba(255,117,24,0.10)' }}
                  >
                    {selectedMember.role}
                  </span>
                  <h3
                    className="font-black leading-tight tracking-[-0.04em]"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#071e36' }}
                  >
                    {selectedMember.name}
                  </h3>
                  {selectedMember.credentials && (
                    <p className="font-semibold mt-1" style={{ fontSize: '12px', color: 'rgba(7,30,54,0.45)', letterSpacing: '0.5px' }}>
                      {selectedMember.credentials}
                    </p>
                  )}
                </div>

                <div className="h-px w-full" style={{ background: '#e8e3dc' }} />

                <p className="leading-[1.82]" style={{ fontSize: '15px', color: '#555' }}>
                  {selectedMember.bio}
                </p>

                <div>
                  <p
                    className="font-black uppercase tracking-[2px] mb-3"
                    style={{ fontSize: '10px', color: 'rgba(7,30,54,0.35)' }}
                  >
                    Connect
                  </p>
                  <div className="flex items-center gap-2">
                    <SocialLink href={selectedMember.social.linkedin} label="LinkedIn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </SocialLink>
                    <SocialLink href={selectedMember.social.twitter} label="Twitter / X">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </SocialLink>
                    <SocialLink href={selectedMember.social.instagram} label="Instagram">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </SocialLink>
                  </div>
                </div>
              </div>

              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                style={{ background: 'rgba(7,30,54,0.12)', color: '#071e36' }}
                onClick={() => setSelectedMember(null)}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
