'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Reveal from '../components/Reveal'
import { useDonation } from '../context/DonationContext'

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
const IMG_SDG_3 = 'https://www.figma.com/api/mcp/asset/76c226ea-d025-4987-84bf-45383411d9b8'
const IMG_SDG_4 = 'https://www.figma.com/api/mcp/asset/74c680f4-450b-45e0-81ba-40b546e17a58'
const IMG_SDG_10 = 'https://www.figma.com/api/mcp/asset/ed06a0d9-118e-4c13-a25d-490bf570ded2'
const IMG_SDG_17 = 'https://www.figma.com/api/mcp/asset/90f9f1b3-b764-4957-8b59-5b1c00fcad85'
const IMG_SDG_8 = 'https://www.figma.com/api/mcp/asset/db54ed81-a432-4dac-b789-b1e65b1ea065'
const IMG_DONATE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999858/Brighton_Chacha_Marwa_4yrs_z6cg85.jpg'
const IMG_QUOTE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778182124/every_smile_1_p8yhro.jpg'

/* ─── Service icon assets ─── */
const ICON_SURGERY = 'https://www.figma.com/api/mcp/asset/4c0a466c-7d73-4039-99e5-d00e710513d5'
const ICON_ORTHO = 'https://www.figma.com/api/mcp/asset/567dea32-92fa-4c64-89fe-5ac2e0471beb'
const ICON_SPEECH = 'https://www.figma.com/api/mcp/asset/efdb2ecc-2b32-483e-8eba-4ae689032709'
const ICON_NUTRITION = 'https://www.figma.com/api/mcp/asset/d8712e65-6f42-419b-88a9-8f7dbb981e49'
const ICON_PSYCHO = 'https://www.figma.com/api/mcp/asset/59096b5d-0cfc-4d1b-9a2b-216e767dc7fd'
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
  img: string
  goal: string
  title: string
  text: string
}

const SDG_CARDS: SdgCard[] = [
  {
    color: '#4d9f38',
    img: IMG_SDG_3,
    goal: 'SDG 3',
    title: 'Good Health & Well-Being',
    text: 'Ensuring healthy lives and promoting well-being by providing life-changing surgical and long-term care.',
  },
  {
    color: '#c5192e',
    img: IMG_SDG_4,
    goal: 'SDG 4',
    title: 'Quality Education',
    text: 'Helping children with cleft conditions overcome speech barriers and stigma that can otherwise prevent school attendance.',
  },
  {
    color: '#dc1367',
    img: IMG_SDG_10,
    goal: 'SDG 10',
    title: 'Reduced Inequalities',
    text: 'Providing free access to specialized care for children and families who might otherwise be unable to afford treatment.',
  },
  {
    color: '#19486a',
    img: IMG_SDG_17,
    goal: 'SDG 17',
    title: 'Partnerships for the Goals',
    text: 'Working with local and international partners to expand access to comprehensive cleft care.',
  },
  {
    color: '#a31942',
    img: IMG_SDG_8,
    goal: 'SDG 8',
    title: 'Decent Work & Economic Growth',
    text: 'Supporting long-term social and economic participation by helping patients pursue education and employment.',
  },
]

interface ServiceCard {
  icon: string
  title: string
  sub: string
}

const SERVICES_CARDS: ServiceCard[] = [
  { icon: ICON_SURGERY, title: 'Cleft Surgery', sub: 'Primary and secondary surgical repair.' },
  { icon: ICON_ORTHO, title: 'Orthodontics', sub: 'Long-term dental alignment correction.' },
  { icon: ICON_SPEECH, title: 'Speech Therapy', sub: 'Support for communication development.' },
  { icon: ICON_NUTRITION, title: 'Nutrition', sub: 'Pre and post-operative feeding support.' },
  { icon: ICON_PSYCHO, title: 'Psychosocial', sub: 'Emotional and counseling support.' },
]

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
    name: 'Dr. Sarah Kimani',
    role: 'Chief Medical Officer',
    dept: 'Clinical',
    img: IMG_CARE_A,
    bio: 'Dr. Kimani leads BelaRisu\'s medical operations with over 14 years of experience in reconstructive and craniofacial surgery. She has overseen more than 400 successful cleft procedures across East Africa and serves as the clinical lead on all surgical protocols.',
    social: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    name: 'Dr. James Otieno',
    role: 'Lead Surgeon',
    dept: 'Clinical',
    img: IMG_CARE_B,
    bio: 'Dr. Otieno specializes in primary and secondary cleft lip and palate repair. With a fellowship in craniofacial surgery from Nairobi and advanced training in Europe, he brings world-class precision to every operating theatre at BMC.',
    social: { linkedin: '#', twitter: '#', instagram: null },
  },
  {
    name: 'Agnes Mwangi',
    role: 'Head of Speech Therapy',
    dept: 'Rehabilitation',
    img: IMG_CARE_C,
    bio: 'Agnes has dedicated her career to helping patients find their voice. She leads speech and language therapy at BMC, working with children and adults post-surgery to rebuild communication confidence and overcome school and social barriers.',
    social: { linkedin: '#', twitter: null, instagram: '#' },
  },
  {
    name: 'Dr. Peter Njoroge',
    role: 'ENT Specialist',
    dept: 'Clinical',
    img: IMG_SPLIT_L,
    bio: 'Dr. Njoroge oversees ear, nose, and throat care for all patients — a critical component of long-term cleft treatment. He monitors hearing health, treats recurring infections, and ensures the airway and auditory systems develop correctly post-surgery.',
    social: { linkedin: '#', twitter: '#', instagram: null },
  },
  {
    name: 'Grace Achieng',
    role: 'Psychosocial Counselor',
    dept: 'Rehabilitation',
    img: IMG_SPLIT_R,
    bio: 'Grace provides emotional and psychosocial support to patients and their families throughout the care journey. She helps children and adults build confidence, process stigma, and develop the resilience to participate fully in school, work, and community life.',
    social: { linkedin: '#', twitter: null, instagram: '#' },
  },
  {
    name: 'Faith Wambui',
    role: 'Lead Nutritionist',
    dept: 'Rehabilitation',
    img: IMG_STORY_L,
    bio: 'Faith specializes in pre- and post-operative nutritional care for cleft patients. She designs individualized feeding and growth plans for infants and children, ensuring every patient has the nutritional foundation needed to heal well and grow strong.',
    social: { linkedin: '#', twitter: '#', instagram: '#' },
  },
]

const TEAM_DEPTS = ['All', 'Clinical', 'Rehabilitation'] as const
type TeamDept = typeof TEAM_DEPTS[number]

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
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 items-start">

          <Reveal direction="up">
            <div className="rounded-[16px] overflow-hidden lg:w-[340px] xl:w-[380px] shrink-0" style={{ minHeight: '420px' }}>
              <img src={IMG_STORY_L} alt="Our story" className="w-full h-full object-cover" style={{ minHeight: '420px' }} />
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
            <div className="max-w-[760px] leading-[1.85] space-y-3" style={{ fontSize: '16px', color: '#696969' }}>
              <p>Access to safe surgery and CCC is not just a medical need. It is a matter of equity and opportunity.</p>
              <p>Our work allows children and adults born with cleft conditions to receive life-changing treatment that restores their health, confidence, and ability to participate fully in school, work, and community life. This contributes to broader global efforts to improve health, reduce inequality, and expand opportunity — directly aligned with the United Nations Sustainable Development Goals:</p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {SDG_CARDS.slice(0, 3).map(({ color, img, goal, title, text }, i) => (
            <motion.div
              key={goal}
              className="flex flex-col rounded-[20px] overflow-hidden"
              style={{ background: color }}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div className="flex items-center justify-center px-6 pt-8 pb-5">
                <img
                  src={img}
                  alt={goal}
                  className="object-contain rounded-[12px]"
                  style={{ width: '160px', height: '160px' }}
                />
              </div>
              <div className="mx-6 h-px" style={{ background: 'rgba(255,255,255,0.18)' }} />
              <div className="flex flex-col gap-1.5 px-6 py-5">
                <p className="font-black uppercase tracking-[2px]" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>{goal}</p>
                <p className="font-black text-white leading-tight tracking-[-0.3px]" style={{ fontSize: '15px' }}>{title}</p>
                <p className="text-white/75 leading-[1.7]" style={{ fontSize: '13.5px' }}>{text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SDG_CARDS.slice(3).map(({ color, img, goal, title, text }, i) => (
            <motion.div
              key={goal}
              className="flex flex-row rounded-[20px] overflow-hidden"
              style={{ background: color }}
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 + 0.27, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div className="flex items-center justify-center p-6 shrink-0">
                <img
                  src={img}
                  alt={goal}
                  className="object-contain rounded-[12px]"
                  style={{ width: '130px', height: '130px' }}
                />
              </div>
              <div className="my-5 w-px" style={{ background: 'rgba(255,255,255,0.18)' }} />
              <div className="flex flex-col justify-center gap-1.5 px-6 py-6">
                <p className="font-black uppercase tracking-[2px]" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>{goal}</p>
                <p className="font-black text-white leading-tight tracking-[-0.3px]" style={{ fontSize: '15px' }}>{title}</p>
                <p className="text-white/75 leading-[1.7]" style={{ fontSize: '13.5px' }}>{text}</p>
              </div>
            </motion.div>
          ))}
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
              src="https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777999855/Brighton_Chacha_Marwa_4yrs._ie0vzj.jpg"
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
              <div className="max-w-[580px] p-10 sm:p-12 xl:p-16 flex flex-col gap-4">
                <motion.h2
                  className="font-black leading-[1.2] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)' }}
                  animate={{ opacity: isHovered ? 0.95 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className='text-white'>Give a Child Their </span>
                  <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>First Smile</em>
                </motion.h2>
                <motion.p
                  className="leading-[1.6]"
                  style={{ fontSize: '14px', color: '#fff', maxWidth: '440px' }}
                  animate={{ opacity: isHovered ? 0.9 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Your generosity brings life-changing care to those who need it most. Join us in making a profound difference.
                </motion.p>
                <div>
                  <motion.button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 font-black text-[13px] px-6 py-3 rounded-[14px] transition-all duration-200 hover:opacity-90"
                    style={{ background: '#fff', color: '#ff7518', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
                    whileHover={{ scale: 1.02, opacity: 0.95 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Donate Now
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
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
          <div className={`${WRAP} flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10`}>
            <div>
              <Label>Our Experts</Label>
              <h2
                className="font-black leading-[1.1] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', color: '#071e36' }}
              >
                The People Behind{' '}
                <em style={{ color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}>Every Smile</em>
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div
                className="flex items-center gap-1 p-1 rounded-full"
                style={{ background: 'rgba(7,30,54,0.07)' }}
              >
                {TEAM_DEPTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setFilterDept(dept)}
                    className="relative px-4 py-1.5 rounded-full text-[12px] font-black tracking-[0.3px] transition-colors duration-200 focus:outline-none"
                    style={{ color: filterDept === dept ? '#ffffff' : 'rgba(7,30,54,0.45)' }}
                  >
                    {filterDept === dept && (
                      <motion.span
                        layoutId="team-filter-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: '#071e36' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{dept}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={scrollTeamPrev}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: canScrollPrev ? '#071e36' : 'rgba(7,30,54,0.08)',
                    color: canScrollPrev ? '#ffffff' : 'rgba(7,30,54,0.25)',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={scrollTeamNext}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: canScrollNext ? '#071e36' : 'rgba(7,30,54,0.08)',
                    color: canScrollNext ? '#ffffff' : 'rgba(7,30,54,0.25)',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div
          ref={teamCarouselRef}
          className={`${WRAP} flex gap-4 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden`}
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {TEAM
              .filter((m) => filterDept === 'All' || m.dept === filterDept)
              .map((member, i) => (
                <motion.div
                  key={member.name}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="group relative shrink-0 rounded-[20px] overflow-hidden cursor-pointer"
                  style={{ width: '300px', height: '420px', scrollSnapAlign: 'start' }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="absolute inset-x-0 top-0 w-full h-full group-hover:h-[56%] overflow-hidden transition-all duration-500 ease-out">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="font-black tracking-[2px] uppercase px-2.5 py-1 rounded-full text-white"
                        style={{ fontSize: '9px', background: 'rgba(7,30,54,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                      >
                        {member.dept}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="font-black" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
                        {String(TEAM.indexOf(member) + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 w-full h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(to top, rgba(7,30,54,0.7) 0%, transparent 100%)' }}
                    />
                  </div>

                  <div
                    className="absolute bottom-0 left-0 w-full flex flex-col justify-center px-5 py-5 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                    style={{ height: '44%', background: '#071e36' }}
                  >
                    <p
                      className="font-black leading-tight tracking-[-0.3px] mb-1"
                      style={{ fontSize: '17px', color: '#ffffff' }}
                    >
                      {member.name}
                    </p>
                    <p className="font-semibold mb-3" style={{ fontSize: '12px', color: '#ff7518' }}>
                      {member.role}
                    </p>
                    <p
                      className="leading-[1.65] line-clamp-2"
                      style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.6)' }}
                    >
                      {member.bio}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} onClick={(e) => e.stopPropagation()} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} onClick={(e) => e.stopPropagation()} aria-label="Twitter" target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      )}
                      {member.social.instagram && (
                        <a href={member.social.instagram} onClick={(e) => e.stopPropagation()} aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 hover:-rotate-45"
                        style={{ background: 'rgba(255,117,24,0.22)', color: '#ff7518' }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {SERVICES_CARDS.map(({ icon, title, sub }, i) => (
            <motion.div
              key={title}
              className="rounded-[16px] p-6 border flex flex-col gap-3"
              style={{ background: '#f9f9f9', borderColor: '#e1e1e1' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-accent shrink-0">
                <img src={icon} alt={title} className="w-6 h-6 object-contain" />
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
                <img src={ICON_QUOTE} alt="" className="w-10 h-10" />
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
