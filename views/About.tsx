'use client'

import { useState, useEffect, useRef } from 'react'
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

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Figma assets ─── */
const IMG_HERO = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999410/1H4A3138_rpk5lr.jpg'
const IMG_STORY_L = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999411/1H4A3088_enrccn.jpg'
const IMG_FULL = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999413/IMG_0019_id2y16.jpg'
const IMG_CARE_A = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997868/Care_That_grows_with_you_1_vugnlh.jpg'
const IMG_CARE_B = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997867/Care_That_grows_with_you_2JPG_wmezgb.jpg'
const IMG_CARE_C = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997868/Care_That_grows_with_you_3_ufwofk.jpg'
const IMG_SPLIT_L = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999411/IMG_0011_raryur.jpg'
const IMG_SPLIT_R = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999418/1H4A5074_eymfxz.jpg'
const IMG_DONATE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246027/Brighton_Chacha_Marwa_4yrs_1_z0tcog.webp'
const IMG_QUOTE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778182124/every_smile_1_p8yhro.jpg'
const IMG_CARE_1 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001798/ChatGPT_Image_May_5_2026_08_22_15_PM_hvd3dp.png'
const IMG_CARE_2 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001796/ChatGPT_Image_May_5_2026_08_22_06_PM_pjwlaz.png'
const IMG_CARE_3 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001795/ChatGPT_Image_May_5_2026_08_22_29_PM_lpuepj.png'
const IMG_SPLIT_4 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001053/1H4A5193_dg4cqr.jpg'
const IMG_SPLIT_5 = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778001045/1H4A5164_2_qgwnob.jpg'

const ICON_QUOTE = 'https://www.figma.com/api/mcp/asset/f8d52173-4111-46f8-b04f-1764696393d0'

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
    social: { linkedin: '#', twitter: null, instagram: null },
  },
  {
    name: 'Martin W. Kamau',
    role: 'Lead Surgeon',
    dept: 'Clinical',
    img: IMG_CARE_2,
    bio: 'Martin W. Kamau is the co-founder and Lead Surgeon at BelaRisu Medical Centre, with over a decade of experience in Dental and Oral-Maxillofacial Surgery. His extensive field experience across the continent has been instrumental in shaping the Centre\'s establishment, its life-changing cleft care programs, and the development of the training hub that equips the next generation of surgical professionals. He has pioneered innovative cleft care initiatives, combining local expertise with global standards to drive BelaRisu\'s mission of delivering high-quality, equitable, and patient-centered care.',
    social: { linkedin: '#', twitter: null, instagram: null },
  },
  {
    name: 'Abdulhakim Kimani',
    role: 'Chief Operating Officer',
    dept: 'Leadership',
    img: IMG_CARE_3,
    bio: 'Abdulhakim Kimani is the visionary co-founder of BelaRisu Medical Centre, playing an instrumental role in establishing the Centre, shaping its mission, and stewarding it into the beacon of hope it is today. As Chief Operating Officer, he oversees day-to-day operations and drives interdisciplinary initiatives that strengthen patient-centered programs. An avid field team leader, he advances the Centre\'s mission across the continent through its Foundation arm. Abdulhakim is also an accomplished humanitarian photographer, using visual storytelling to connect the wider public with the Centre and the children it serves.',
    social: { linkedin: null, twitter: null, instagram: null },
  },
  {
    name: 'Rose Maket',
    role: 'Chief Growth Officer',
    dept: 'Leadership',
    img: IMG_SPLIT_4,
    bio: 'Rose Maket is a strategic growth leader with over 20 years of experience across the private sector, social enterprises, and start-ups. She specializes in driving organizational growth through strategic partnerships, revenue generation, operational excellence, and the development of high-performing teams. At BelaRisu Medical Center, she focuses on expanding partnerships and strengthening sustainable financing to support the organization\'s growth and the delivery of life-changing surgical care. Rose also serves on the boards of Alive and Kicking Kenya and Savannah Hospital.',
    social: { linkedin: '#', twitter: null, instagram: null },
  },
  {
    name: 'Eleleta Surafel',
    role: 'Chief of Staff',
    dept: 'Leadership',
    img: IMG_SPLIT_5,
    bio: 'Eleleta Surafel is a public health professional with expertise in health systems strengthening and equity-focused programming. At BelaRisu Medical Centre, she supports leadership in advancing strategic initiatives, strengthening partnerships, and designing systems that expand access to surgical care for children and families affected by cleft conditions. She has led initiatives with global and regional institutions including Women in Global Health, Africa CDC, and UNFPA, and serves as an Advisory Council Member at Amref Health Africa in Ethiopia.',
    social: { linkedin: '#', twitter: null, instagram: null },
  },
  {
    name: 'Lynnah Temba',
    role: 'Program Manager',
    dept: 'Operations',
    img: IMG_STORY_L,
    bio: 'Since the very first day BelaRisu Medical Center opened its doors, Lynnah has been one of the welcoming faces at the heart of our patient journey. Beginning her career as an Administrative Associate and now serving as Program Manager, she has played a central role in coordinating the many moving parts that ensure patients and families are supported throughout their care journey with us.',
    social: { linkedin: null, twitter: null, instagram: null },
  },
]

const TEAM_DEPTS = ['All', 'Leadership', 'Clinical', 'Operations'] as const
type TeamDept = (typeof TEAM_DEPTS)[number]

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
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [filterDept, setFilterDept] = useState<TeamDept>('All')
  const [isHovered, setIsHovered] = useState(false);


  /* ── Team carousel ── */
  const teamCarouselRef = useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false)
  const [canScrollNext, setCanScrollNext] = useState<boolean>(true)

  useEffect(() => {
    const el = teamCarouselRef.current
    if (!el) return
    const update = () => {
      setCanScrollPrev(el.scrollLeft > 8)
      setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const el = teamCarouselRef.current
    if (!el) return
    el.scrollTo({ left: 0, behavior: 'smooth' })
    setTimeout(() => {
      setCanScrollPrev(false)
      setCanScrollNext(el.scrollWidth > el.clientWidth + 8)
    }, 320)
  }, [filterDept])

  const scrollTeamPrev = () => {
    teamCarouselRef.current?.scrollBy({ left: -324, behavior: 'smooth' })
  }
  const scrollTeamNext = () => {
    teamCarouselRef.current?.scrollBy({ left: 324, behavior: 'smooth' })
  }

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
      <div className={`${WRAP} pt-16 pb-20`}>
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
      <div className={`${WRAP} py-20 xl:py-[100px]`}>
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-stretch">

          <Reveal direction="up" className="lg:w-[340px] xl:w-[380px] shrink-0">
            <div className="rounded-[16px] overflow-hidden h-full" style={{ minHeight: '420px' }}>
              <img src={IMG_STORY_L} alt="Our story" className="w-full h-full object-cover" />
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
      <div className={`${WRAP} pb-20 xl:pb-[100px]`}>
        <Reveal direction="up">
          <div className="w-full rounded-[16px] overflow-hidden" style={{ height: 'clamp(260px, 35vw, 546px)' }}>
            <img src={IMG_FULL} alt="" className="w-full h-full object-cover" />
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          OUR CARE MODEL
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-20 xl:pb-[100px]`}>
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14 items-start">

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
      <div className={`${WRAP} pb-20 xl:pb-[100px]`}>
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
      <div className={`${WRAP} pb-20 xl:pb-[100px]`}>
        <Reveal direction="up">
          <div className="flex flex-col gap-4 mb-10">
            <Label>Our Global Impact</Label>
            <h2
              className="font-black leading-[1.1] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.75rem)', color: '#071e36' }}
            >
              Care that Contributes to{' '}
              <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>Global Goals</em>
            </h2>
            <div className="leading-[1.85] space-y-3" style={{ fontSize: '16px', color: '#696969' }}>
              <p>Access to safe surgery and CCC is not just a medical need. It is a matter of equity and opportunity.</p>
              <p>Our work allows children and adults born with cleft conditions to receive life-changing treatment that restores their health, confidence, and ability to participate fully in school, work, and community life. This contributes to broader global efforts to improve health, reduce inequality, and expand opportunity — directly aligned with the United Nations Sustainable Development Goals:</p>
            </div>
          </div>
        </Reveal>

        {/* SDG tiles — all 5 in a unified grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SDG_CARDS.map(({ color, goal, title, text }, i) => {
            const num = goal.replace('SDG ', '')
            return (
              <motion.div
                key={goal}
                className="flex flex-col rounded-[20px] overflow-hidden relative"
                style={{ background: color, minHeight: '260px' }}
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
                  {/* SDG number badge */}
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
      <div className={`${WRAP} pb-20 xl:pb-[100px]`}>
        <Reveal direction="up">
          <div
            className="relative rounded-[24px] overflow-hidden"
            style={{ minHeight: '523px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Default Image */}
            <motion.img
              src={IMG_DONATE_BG}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Hover Image */}
            <motion.img
              src="https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246028/Brighton_Chacha_Marwa_4yrs._1_apmux6.webp"
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

            <div className="relative z-10 flex items-center justify-end min-h-[523px]">
              <div className="max-w-[460px] p-10 sm:p-12 xl:p-16 flex flex-col gap-4">
                <motion.p
                  className="font-black uppercase tracking-[3px]"
                  style={{ fontSize: '8px', color: 'rgba(255,255,255,0.32)' }}
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
                  className="text-[12px] leading-[1.7] font-light"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
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
      <div className="pb-20 xl:pb-[100px]">

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

        <div className={`${WRAP} grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5`}>
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="group relative rounded-[20px] overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3/4' }}
              onClick={() => setSelectedMember(member)}
            >
              {/* Full-bleed image */}
              <img
                src={member.img}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />

              {/* Permanent bottom gradient — always shows name */}
              <div
                className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.90) 0%, rgba(7,30,54,0.4) 50%, transparent 100%)' }}
              />

              {/* Permanent name strip */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-5 z-10 transition-opacity duration-400 group-hover:opacity-0">
                <p className="font-black text-white leading-tight tracking-[-0.3px] mb-0.5" style={{ fontSize: '15px' }}>
                  {member.name}
                </p>
                <p className="font-semibold" style={{ fontSize: '11px', color: '#ff7518' }}>
                  {member.role}
                </p>
              </div>

              {/* Hover overlay — fades + slides in smoothly */}
              <div
                className="absolute inset-0 z-20 flex flex-col justify-end px-5 pb-5 pt-10
                  opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-500 ease-out"
                style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.96) 0%, rgba(7,30,54,0.72) 60%, transparent 100%)' }}
              >
                {/* Name + role */}
                <p className="font-black text-white text-[15px] leading-tight tracking-[-0.3px] mb-0.5">
                  {member.name}
                </p>
                <p className="font-semibold text-[11px] mb-3" style={{ color: '#ff7518' }}>
                  {member.role}
                </p>

                {/* Bio snippet */}
                <p
                  className="text-[11.5px] leading-[1.65] line-clamp-3 mb-4"
                  style={{ color: 'rgba(255,255,255,0.68)' }}
                >
                  {member.bio}
                </p>

                {/* Social + expand */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="LinkedIn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,117,24,0.25)', color: '#ff7518' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Number badge (top-left, always visible) */}
              <div className="absolute top-3 left-3 z-30">
                <span
                  className="font-black tabular-nums text-[10px] tracking-[1px]"
                  style={{ color: 'rgba(255,255,255,0.45)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════
          COMPREHENSIVE CARE
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-20 xl:pb-[100px]`}>

        <Reveal direction="up">
          <div className="max-w-[572px] mb-10">
            <h2
              className="font-black leading-[1.1] tracking-[-0.04em] mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3rem)', color: '#0a2a49' }}
            >
              Comprehensive Care —{' '}
              <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>Not a Single Surgery</em>
            </h2>
            <p className="leading-[1.8]" style={{ fontSize: '16px', color: '#071e36' }}>
              True cleft care is an ongoing journey. It is a comprehensive, coordinated, and deeply patient-centred process involving multiple specialists.
            </p>
          </div>
        </Reveal>

        // The grid component
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {SERVICES_CARDS.map(({ icon: Icon, title, sub }, i) => (
            <motion.div
              key={title}
              className="rounded-[16px] p-6 border flex flex-col gap-3"
              style={{ background: '#f9f9f9', borderColor: '#e1e1e1' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-accent shrink-0">
                <Icon size={24} className="w-6 h-6 text-white" />
              </div>
              <p className="font-black text-[15px]" style={{ color: '#0a2a49' }}>{title}</p>
              <p className="text-[13px] leading-[1.65]" style={{ color: '#071e36' }}>{sub}</p>
            </motion.div>
          ))}
        </div>

        <Reveal direction="up" delay={0.06}>
          <div
            className="relative rounded-[16px] overflow-hidden"
            style={{ height: 'clamp(340px, 50vw, 750px)' }}
          >
            <img src={IMG_QUOTE_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />

            <div
              className="absolute flex flex-col gap-3 items-center justify-center px-8 py-6 rounded-[12px]"
              style={{
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                background: 'rgba(28,28,28,0.46)',
                top: '162px',
                left: '111px',
                width: '263px',
              }}
            >
              <div className="rotate-180 shrink-0">
                <Quote className='w-6 h-6 text-white' />
              </div>
              <p
                className="text-white font-semibold text-center leading-snug tracking-[-0.5px]"
                style={{ fontSize: '15px' }}
              >
                "Every smile is a reminder of cleft care done right."
              </p>
              <div className="flex items-center gap-3 w-full">
                <div className="h-px bg-white/30 flex-1" />
                <p className="text-white/70 uppercase tracking-[2px] text-[10px] font-medium whitespace-nowrap">
                  The BelaRisu Team
                </p>
                <div className="h-px bg-white/30 flex-1" />
              </div>
            </div>
          </div>
        </Reveal>

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
