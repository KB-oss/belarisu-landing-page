'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import { useDonation } from '../context/DonationContext'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Figma assets ─── */
const IMG_SURGERY = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000763/Cleft_Palate_Repair_qiuaeo.jpg'
const IMG_ORTHO = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778513802/WhatsApp_Image_2026-05-11_at_11.14.34_ashnkb.jpg'
const IMG_SPEECH = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000862/Speech_Therapy_aksuao.jpg'
const IMG_NUTRITION = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778179995/nutrition-home_1_vpsqeq.jpg'
const IMG_PSYCHO = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000764/pshyocology_gsvwmr.png'
const IMG_ENT = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778000766/ENT_zwe3nh.png'
const IMG_DONATE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246026/Kaylan_Amani_Mumo_2yrs11mnths_1_xcadvp.webp'

/* ─── Types ─── */
interface SubItem {
  title: string
  text: string
}

type ServiceSubType = 'grid' | 'labeled' | 'checks'

interface Service {
  id: string
  label: string
  img: string
  short: string
  intro: string[]
  subType: ServiceSubType
  subs: SubItem[] | string[]
  closing: string
}

/* ─── Service data ─── */
const SERVICES: Service[] = [
  {
    id: 'surgery',
    label: 'Surgery',
    img: IMG_SURGERY,
    short: 'Highly specialized surgical repair of cleft lip and cleft palate performed by experienced surgeons using modern techniques to restore function and appearance.',
    intro: [
      'Surgical repair is the cornerstone of cleft treatment, laying the foundation for the next stages of care while restoring both function and appearance for patients born with cleft lip and cleft palate.',
      'Our surgical team performs highly specialized cleft procedures using modern techniques to carefully reconstruct the lip, nose, and palate. Cleft surgery is often performed in stages, depending on the patient\'s age and needs:',
    ],
    subType: 'grid',
    subs: [
      { title: 'Cleft Lip Repair', text: 'Usually performed in early infancy (around 3–6 months), this surgery restores the shape of the lip and nose, allowing for normal feeding, facial growth, and early social integration.' },
      { title: 'Cleft Palate Repair', text: 'Typically performed between 9–18 months, palate repair restores the separation between the mouth and nose, enabling proper speech development, improved eating, and reduced risk of ear infections.' },
    ],
    closing: 'Surgery is most effective when patients are healthy and adequately nourished. Children with cleft conditions often face feeding challenges that affect weight and growth. Our nutrition team works closely with families to ensure patients are at a safe and healthy weight for surgery, improving healing, reducing complications, and supporting long-term outcomes.\n\nCleft surgery is part of a coordinated, multidisciplinary care plan, designed to complement other services and support the patient\'s overall development. Each procedure is a critical step toward helping children eat, speak, grow, and thrive with confidence.',
  },
  {
    id: 'orthodontics',
    label: 'Orthodontics and Dental Care',
    img: IMG_ORTHO,
    short: 'Orthodontic assessment and treatment help guide proper jaw development, improve dental alignment, and support patients in long-term oral health.',
    intro: [
      'Patients with cleft lip and palate often face unique dental and jaw alignment challenges. Orthodontic and dental care is essential to ensure healthy teeth, proper jaw development, and a functional bite.',
      'Orthodontists and dentists work closely with the surgical team to plan interventions that support both facial growth and overall oral health. Treatments often include:',
    ],
    subType: 'labeled',
    subs: [
      { title: 'Pre-surgical orthodontics', text: 'Devices to gently align the gums, jaws, and teeth before surgery.' },
      { title: 'Orthodontic braces', text: 'To correct teeth alignment as children grow' },
      { title: 'Dental care and hygiene', text: 'Regular check-ups to prevent cavities, gum disease, and other oral health issues.' },
    ],
    closing: 'Many orthodontic interventions are staged over years, following the patient\'s facial and dental growth into adulthood. In addition to supporting the function of the mouth, proper orthodontic care improves speech, eating, and appearance, helping patients feel confident in social settings.',
  },
  {
    id: 'speech',
    label: 'Speech and Language Therapy',
    img: IMG_SPEECH,
    short: 'Speech therapy supports children and adults in developing clear speech following cleft palate repair, helping them communicate with confidence.',
    intro: [
      'Cleft palate can affect the ability to produce certain sounds, which may make speech difficult to understand. Speech and language therapy helps children and adults develop clear, confident communication skills.',
      'Speech therapists assess each patient\'s unique needs and design personalized therapy plans. Therapy includes:',
    ],
    subType: 'checks',
    subs: [
      'Exercises to strengthen oral muscles',
      'Guidance on tongue placement, airflow, and sound production',
      'Practice for everyday communication in school and social settings',
    ],
    closing: 'Speech therapy typically begins after palate repair and continues through childhood, with ongoing support as needed. Early intervention can significantly improve speech clarity, helping children participate fully in school and social life.\n\nTherapy is also offered to adolescents and adults who may need additional support to refine speech after surgery.',
  },
  {
    id: 'nutrition',
    label: 'Nutrition Support',
    img: IMG_NUTRITION,
    short: 'Children born with cleft conditions often experience feeding challenges and growth delays. Our nutrition team provides feeding guidance, growth monitoring, and nutritional rehabilitation.',
    intro: [
      'Feeding challenges are common in children born with cleft lip and palate. These challenges can affect growth, weight gain, and readiness for surgery. Proper nutrition is therefore critical to overall health and successful treatment outcomes.',
      'A nutrition team works closely with families to:',
    ],
    subType: 'checks',
    subs: [
      'Assess growth and weight gain',
      'Provide guidance on specialized feeding techniques and bottles',
      'Recommend dietary modifications and supplementation as needed',
    ],
    closing: 'By ensuring children are healthy and well-nourished, we improve surgical outcomes, recovery, and long-term growth. Nutrition support continues throughout the patient\'s development, helping them physically and academically.',
  },
  {
    id: 'psychosocial',
    label: 'Psychosocial Counseling and Family Support',
    img: IMG_PSYCHO,
    short: 'Cleft conditions can impact emotional wellbeing due to stigma and social exclusion. Counseling and psychological support help patients and families navigate these challenges.',
    intro: [
      'Living with a cleft condition can be challenging for both patients and their families. Emotional wellbeing is just as important as physical health. Psychosocial counseling supports patients in developing confidence, coping with stigma, and navigating social challenges.',
      'Psychologists and social workers provide:',
    ],
    subType: 'checks',
    subs: [
      'Individual counseling for children and adult patients',
      'Family counseling and guidance',
      'Peer support opportunities',
      'Education on coping strategies for school, work, and other social situations',
    ],
    closing: 'Psychosocial support helps patients overcome fear, build resilience, and integrate fully into their communities, complementing medical and surgical care.',
  },
  {
    id: 'ent',
    label: 'ENT Care',
    img: IMG_ENT,
    short: 'ENT care helps children with cleft conditions maintain healthy hearing, breathing, and airway function, supporting speech development and overall wellbeing.',
    intro: [
      'Patients born with cleft palate are at higher risk of ear infections, hearing loss, and airway difficulties. Regular ENT care is therefore a critical component of comprehensive cleft treatment.',
      'ENT specialists work closely with surgeons, speech therapists, and audiologists to ensure that patients maintain healthy ears, noses, and airways. ENT care includes:',
    ],
    subType: 'checks',
    subs: [
      'Hearing assessments and audiology support to detect early hearing issues',
      'Treatment for middle ear infections, which are common in children with cleft palate',
      'Ear tube insertion when necessary to prevent repeated infections and protect hearing',
      'Monitoring and management of nasal and airway health, supporting breathing, speech, and overall comfort',
    ],
    closing: 'ENT care is coordinated with other CCC services to optimize speech development, surgical outcomes, and quality of life. Regular check-ups help detect and address problems early, ensuring children can hear, speak, and grow without avoidable complications.',
  },
]

/* ─── Circle check icon ─── */
function CircleCheck() {
  return (
    <svg className="w-5 h-5 shrink-0 text-accent mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

/* ─── Arrow right icon ─── */
function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/* ─── Service card ─── */
function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      id={service.id}
      className="bg-white rounded-[16px] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      {/* Image banner */}
      <div className="relative overflow-hidden" style={{ height: '350px' }}>
        <img
          src={service.img}
          alt={service.label}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[30%] to-black/75" />
        <div className="absolute bottom-0 left-0 right-0 px-8 py-6 flex flex-col gap-3">
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.1rem)' }}
          >
            {service.label}
          </h2>
          <p className="text-white/90 text-[15px] leading-[1.6] max-w-2xl font-light">
            {service.short}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 pt-6 flex flex-col gap-5">
        <div className="space-y-4">
          {service.intro.map((p, i) => (
            <p key={i} className="text-[15px] leading-[1.7]" style={{ color: '#7b7b7b' }}>{p}</p>
          ))}
        </div>

        {/* Sub-items */}
        {service.subType === 'grid' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {(service.subs as SubItem[]).map((sub) => (
              <div key={sub.title} className="flex flex-col gap-3 bg-[#071e36] rounded-[14px] p-5">
                <p className="font-bold text-[17px]" style={{ color: '#ff7518' }}>{sub.title}</p>
                <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.65)' }}>{sub.text}</p>
              </div>
            ))}
          </div>
        )}

        {service.subType === 'labeled' && (
          <div className="flex flex-col gap-4">
            {(service.subs as SubItem[]).map((sub) => (
              <div key={sub.title} className="flex flex-col gap-2 py-4 border-b last:border-b-0" style={{ borderColor: '#f0f0f0' }}>
                <p className="font-bold text-[17px]" style={{ color: '#ff7518' }}>{sub.title}</p>
                <p className="text-[14px] leading-[1.7]" style={{ color: '#7e7c7c' }}>{sub.text}</p>
              </div>
            ))}
          </div>
        )}

        {service.subType === 'checks' && (
          <div className="flex flex-col gap-3 pl-2">
            {(service.subs as string[]).map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CircleCheck />
                <p className="text-[15px] leading-[1.6]" style={{ color: '#414141' }}>{item}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {service.closing.split('\n\n').map((para, i) => (
            <p key={i} className="text-[14px] leading-[1.7]" style={{ color: '#7e7c7c' }}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════ */
export default function Services() {
  const { openModal } = useDonation()
  const [activeId, setActiveId] = useState<string>('surgery')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isHovered, setIsHovered] = useState(false);


  /* Intersection observer — highlight active sidebar item */
  useEffect(() => {
    const headings = SERVICES.map(s => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    )
    headings.forEach(el => observerRef.current!.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -120, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="pt-[88px]" style={{ background: '#f4f4f4', overflowX: 'clip' }}>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <div className={`${WRAP} pt-16 pb-20`}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <h1
            className="font-black leading-[1.0] tracking-[-0.045em] mb-0"
            style={{ fontSize: 'clamp(2.8rem, 6.6vw, 6rem)', color: '#071e36' }}
          >
            Complete Care.
          </h1>
          <h1
            className="font-black leading-[1.0] tracking-[-0.04em] mb-8"
            style={{ fontSize: 'clamp(2.8rem, 6.6vw, 6rem)', color: '#ff7518', fontFamily: PLAYFAIR, fontStyle: 'italic' }}
          >
            Every Step.
          </h1>
          <p
            className="text-[18px] sm:text-[20px] font-light leading-[1.6] max-w-[720px] mx-auto"
            style={{ color: '#45556c' }}
          >
            Our Comprehensive Cleft Care model brings together an extraordinary multi-disciplinary team
            to deliver high-quality, individually targeted treatment.
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════
          TWO-COLUMN — sticky sidebar + service cards
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-28`}>
        <div className="flex gap-8 xl:gap-10">

          {/* Left — sticky sidebar */}
          <div className="hidden lg:block shrink-0 self-stretch" style={{ width: '260px' }}>
            <div className="sticky top-[108px] flex flex-col gap-1 pt-8">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="text-left px-4 py-3 rounded-[14px] transition-all duration-200 text-[15px] font-semibold leading-snug"
                  style={{
                    color: activeId === s.id ? '#ff7518' : '#a8a8a8',
                    background: activeId === s.id ? 'rgba(255,117,24,0.07)' : 'transparent',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — service cards */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 pt-8">
            {SERVICES.map((service, i) => (
              <Reveal key={service.id} direction="up" delay={i === 0 ? 0 : 0.04}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════
          DONATE CTA
      ══════════════════════════════════ */}
      <Reveal direction="up">
        <div className={WRAP}>
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
              src="https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246026/Kaylan_Amani_Mumo_2yrs11mnths_1_1_xddvuk.webp"
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
        </div>
      </Reveal>

    </div>
  )
}
