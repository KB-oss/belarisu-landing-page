'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence , Variants } from 'framer-motion'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Types ─── */
interface ServiceOption {
  id: string
  label: string
  sub: string
}

interface AgeGroup {
  value: string
  label: string
  sub: string
}

interface ContactMethod {
  id: string
  label: string
  sub: string
}

interface FormState {
  service: string
  firstName: string
  lastName: string
  ageGroup: string
  phone: string
  email: string
  description: string
  contactMethod: string
  day: string
  time: string
}

/* ─── Constants ─── */
const STEP_LABELS = ['SERVICE', 'PATIENT', 'CONTACT', 'REVIEW'] as const

const SERVICES: ServiceOption[] = [
  { id: 'surgery',      label: 'Surgery',              sub: 'Cleft lip & palate surgical repair'    },
  { id: 'ent',          label: 'ENT Care',              sub: 'Ear, nose & throat health'             },
  { id: 'orthodontics', label: 'Orthodontics & Dental', sub: 'Jaw development & dental alignment'   },
  { id: 'speech',       label: 'Speech Therapy',        sub: 'Communication & speech development'   },
  { id: 'nutrition',    label: 'Nutritional Support',   sub: 'Feeding guidance & growth monitoring' },
  { id: 'psychosocial', label: 'Psychosocial Care',     sub: 'Counseling for patients & families'   },
]

const AGE_GROUPS: AgeGroup[] = [
  { value: '0-12-months', label: '0–12', sub: 'months' },
  { value: '1-3-years',   label: '1–3',  sub: 'years'  },
  { value: '4-12-years',  label: '4–12', sub: 'years'  },
  { value: '13-17-years', label: '13–17',sub: 'years'  },
  { value: '18-adult',    label: '18+',  sub: 'adult'  },
]

const CONTACT_METHODS: ContactMethod[] = [
  { id: 'phone',    label: 'Phone Call', sub: "We'll call to confirm" },
  { id: 'email',    label: 'Email',      sub: 'Confirmation by email' },
  { id: 'whatsapp', label: 'WhatsApp',   sub: 'Message to confirm'    },
  { id: 'walkin',   label: 'Walk-in',    sub: "I'll visit in person"  },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

const TRUST = [
  'Completely free of charge',
  'Response within 24 hours',
  'Your information is private and secure',
]

/* ─── Icons ─── */
function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function ArrowLeft() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}
function ArrowRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
function CircleCheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

/* ── Service icons ── */
const SVC_ICON: Record<string, React.ReactNode> = {
  surgery: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
    </svg>
  ),
  ent: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4C8.5 4 5 7 5 11c0 2 .8 3.5 2 4.5L7 20h2.5l.5-2.5c.3.1.7.1 1 .1a5 5 0 005-5V8c0-2-1.5-4-4-4z"/>
    </svg>
  ),
  orthodontics: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9c0-2 1.5-4 4-4 1.5 0 2.5.8 3 2 .5-1.2 1.5-2 3-2 2.5 0 4 2 4 4 0 2-.5 4-1.5 6-.5 1-1 2-1.5 2s-1-.5-1.5-2L12 12l-1.5 3c-.5 1.5-1 2-1.5 2s-1-1-1.5-2C4.5 13 3 11 3 9z"/>
      <path d="M9 9h6"/>
    </svg>
  ),
  speech: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  nutrition: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
      <path d="M12 2c2 4 2 8 0 12M12 2C8 6 8 10 12 14"/>
      <path d="M22 2l-5 5"/>
    </svg>
  ),
  psychosocial: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M3 21v-1a9 9 0 0118 0v1"/>
      <path d="M10.5 7c0-.8.7-1.5 1.5-1.5"/>
    </svg>
  ),
}

/* ── Contact method icons ── */
const CONTACT_ICON: Record<string, React.ReactNode> = {
  phone: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15z"/>
    </svg>
  ),
  email: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
    </svg>
  ),
  whatsapp: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
    </svg>
  ),
  walkin: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M7 21l3-5 2.5 2.5 2-3.5 3 6"/>
      <path d="M10 16l-1.5-4L11 9l3 2 2-3"/>
    </svg>
  ),
}

/* ─── Field helper ─── */
interface FieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold text-[13px]" style={{ color: '#26364c' }}>
        {label}{required && <span className="ml-0.5" style={{ color: '#ff7518' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'border rounded-[8px] px-4 py-3 text-[14px] outline-none bg-white w-full transition-colors'
const inputStyle = { borderColor: '#e0e0e0', color: '#171717' }

/* ─── Animation ─── */
const stepVariants: Variants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28, filter: 'blur(4px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -20 : 20, transition: { duration: 0.22 } }),
}

/* ─── Review sub-components ─── */
interface ReviewCardProps {
  title: string
  onEdit: () => void
  children: React.ReactNode
}

function ReviewCard({ title, onEdit, children }: ReviewCardProps) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ border: '1px solid #e0e0e0' }}>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: '#f8fafc', borderBottom: '1px solid #e0e0e0' }}
      >
        <p className="font-bold text-[13px]" style={{ color: '#071e36' }}>{title}</p>
        <button onClick={onEdit} className="text-[12px] font-semibold transition-colors hover:text-accent" style={{ color: '#62748e' }}>
          Edit
        </button>
      </div>
      <div className="px-5 py-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

interface ReviewRowProps {
  label: string
  value: string
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span style={{ color: '#62748e' }}>{label}</span>
      <span className="font-semibold" style={{ color: '#071e36' }}>{value}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
    MAIN COMPONENT
════════════════════════════════════════════════════ */
export default function BookAppointment() {
  const [step, setStep]   = useState<number>(0)
  const [dir, setDir]     = useState<number>(1)
  const [done, setDone]   = useState<boolean>(false)
  const [terms, setTerms] = useState<boolean>(false)
  const [form, setForm]   = useState<FormState>({
    service: '',
    firstName: '', lastName: '', ageGroup: '', phone: '', email: '', description: '',
    contactMethod: '', day: '', time: '',
  })

  const set = (key: keyof FormState, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const canNext = (): boolean => {
    if (step === 0) return !!form.service
    if (step === 1) return !!(form.firstName && form.lastName && form.ageGroup && form.phone)
    if (step === 2) return !!(form.contactMethod && form.time)
    if (step === 3) return terms
    return false
  }

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }
  const handleNext = () => {
    if (step < 3) goTo(step + 1)
    else setDone(true)
  }

  /* ─── Success screen ─── */
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[88px]" style={{ background: '#fdfcfb' }}>
        <motion.div
          className="text-center max-w-md px-8 py-12"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-7" style={{ background: 'rgba(255,117,24,0.10)' }}>
            <CheckIcon className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-black text-[#071e36] tracking-[-0.03em] mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
            Booking{' '}
            <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>Requested!</em>
          </h2>
          <p className="text-[14px] leading-[1.85] mb-8" style={{ color: '#62748e' }}>
            Thank you, <strong className="text-[#071e36]">{form.firstName}</strong>. Our team will confirm your <strong className="text-[#071e36]">{form.service}</strong> appointment within 24 hours. All care at BMC is completely free.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white font-black text-[13px] px-8 py-3.5 rounded-full transition-all"
            style={{ background: '#ff7518', boxShadow: '0 4px 18px rgba(255,117,24,0.30)' }}
          >
            Back to Home <ArrowRight />
          </Link>
        </motion.div>
      </div>
    )
  }

  /* ─── Left panel context ─── */
  interface LeftContext {
    heading: string | null
    body: string | null
    extra?: React.ReactNode
  }

  const leftContext: Record<number, LeftContext> = {
    0: {
      heading: 'What brings you to BMC?',
      body: 'We offer six specialised services as part of our Comprehensive Cleft Care model. Every service is free and coordinated under one roof.',
      extra: (
        <div className="mt-8 grid grid-cols-2 gap-2">
          {SERVICES.map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2 py-1.5">
              <CircleCheckIcon className="w-4 h-4 shrink-0" />
              <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{label}</span>
            </div>
          ))}
        </div>
      ),
    },
    1: {
      heading: 'Tell us about the patient',
      body: 'Your details help our care team prepare for your visit and assign the right specialist to your case before you even arrive.',
    },
    2: { heading: null, body: null },
    3: { heading: null, body: null },
  }

  const ctx = leftContext[step]

  /* ─── Main render ─── */
  return (
    <div className="pt-[88px]" style={{ background: '#fdfcfb', overflowX: 'clip' }}>
      <div className={`${WRAP} py-12 sm:py-16`}>
        <div
          className="flex flex-col lg:flex-row rounded-[24px] overflow-hidden"
          style={{ border: '1px solid #f1f5f9', boxShadow: '0px 20px 60px rgba(7,30,54,0.06)', minHeight: '820px' }}
        >

          {/* ══════════════════════════════
              LEFT PANEL — navy
          ══════════════════════════════ */}
          <div
            className="lg:w-[38%] shrink-0 flex flex-col justify-between p-8 xl:p-12 relative overflow-hidden"
            style={{ background: '#071e36' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(7,30,54,0.85), rgba(7,30,54,0.7) 50%, #071e36)' }}
            />

            <div className="relative z-10">
              {/* Step tracker */}
              <div className="flex items-center gap-0 mb-8">
                {STEP_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] transition-all duration-300 shrink-0"
                        style={{
                          background: i < step ? '#ff7518' : i === step ? '#fff' : 'rgba(255,255,255,0.12)',
                          color: i < step ? '#fff' : i === step ? '#071e36' : 'rgba(255,255,255,0.45)',
                          boxShadow: i === step ? '0 4px 12px rgba(255,255,255,0.2)' : 'none',
                        }}
                      >
                        {i < step ? <CheckIcon className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span
                        className="text-[10px] font-bold tracking-[1px] text-center"
                        style={{ color: i === step ? '#fff' : i < step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div
                        className="flex-1 h-px mx-1 mb-5 transition-all duration-300"
                        style={{ background: i < step ? '#ff7518' : 'rgba(255,255,255,0.15)' }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {ctx.heading && (
                <div className="flex flex-col gap-4">
                  <h2
                    className="font-black text-white leading-[1.1] tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)' }}
                  >
                    {ctx.heading}
                  </h2>
                  <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {ctx.body}
                  </p>
                  {ctx.extra}
                </div>
              )}
            </div>

            {/* Trust signals */}
            <div className="relative z-10 flex flex-col gap-3 pt-10">
              {TRUST.map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,117,24,0.2)' }}>
                    <CheckIcon className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════
              RIGHT PANEL — white form
          ══════════════════════════════ */}
          <div className="flex-1 bg-white flex flex-col p-8 xl:p-12">
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full"
                >

                  {/* STEP 0: Service selection */}
                  {step === 0 && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>Step 1 of 4</p>
                        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)' }}>
                          Which service do you need?
                        </h2>
                        <p className="text-[14px] leading-[1.7]" style={{ color: '#62748e' }}>
                          Select the service that best describes why you're visiting. Not sure? Just pick the closest one.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {SERVICES.map(({ id, label, sub }) => {
                          const selected = form.service === id
                          return (
                            <button
                              key={id}
                              onClick={() => set('service', id)}
                              className="text-left p-4 rounded-[14px] border-2 transition-all duration-200 relative"
                              style={{ borderColor: selected ? '#071e36' : '#e0e0e0', background: selected ? 'rgba(7,30,54,0.04)' : '#fff' }}
                            >
                              {selected && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#071e36' }}>
                                  <CheckIcon className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div
                                className="w-11 h-11 rounded-[12px] flex items-center justify-center mb-3"
                                style={{ background: selected ? 'rgba(7,30,54,0.08)' : '#f1f5f9', color: selected ? '#071e36' : '#62748e' }}
                              >
                                {SVC_ICON[id]}
                              </div>
                              <p className="font-bold text-[14px] mb-0.5" style={{ color: selected ? '#071e36' : '#171717' }}>{label}</p>
                              <p className="text-[12px]" style={{ color: '#62748e' }}>{sub}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Patient details */}
                  {step === 1 && (
                    <div className="flex flex-col gap-5">
                      <div>
                        <p className="text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>Step 2 of 4</p>
                        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)' }}>
                          Patient details
                        </h2>
                        <p className="text-[14px] leading-[1.7]" style={{ color: '#62748e' }}>
                          Tell us about the person who needs care. All fields marked * are required.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="First Name" required>
                          <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="e.g. Amara" className={inputCls} style={inputStyle} />
                        </Field>
                        <Field label="Last Name" required>
                          <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="e.g. Wanjiku" className={inputCls} style={inputStyle} />
                        </Field>
                      </div>

                      <Field label="Patient Age Group" required>
                        <div className="flex gap-2">
                          {AGE_GROUPS.map(({ value, label, sub }) => {
                            const sel = form.ageGroup === value
                            return (
                              <button
                                key={value}
                                onClick={() => set('ageGroup', value)}
                                className="flex-1 flex flex-col items-center justify-center py-3 rounded-[10px] border-2 transition-all duration-200"
                                style={{ borderColor: sel ? '#071e36' : '#e0e0e0', background: sel ? '#071e36' : '#fff' }}
                              >
                                <span className="font-bold text-[14px]" style={{ color: sel ? '#fff' : '#171717' }}>{label}</span>
                                <span className="text-[11px]" style={{ color: sel ? 'rgba(255,255,255,0.65)' : '#62748e' }}>{sub}</span>
                              </button>
                            )
                          })}
                        </div>
                      </Field>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Phone Number" required>
                          <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+254 700 000 000" className={inputCls} style={inputStyle} />
                        </Field>
                        <Field label="Email Address">
                          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className={inputCls} style={inputStyle} />
                        </Field>
                      </div>

                      <Field label="Brief Description">
                        <textarea
                          value={form.description}
                          onChange={(e) => set('description', e.target.value)}
                          placeholder="Anything helpful about the patient's condition or history (optional)…"
                          rows={3}
                          className={`${inputCls} resize-none`}
                          style={inputStyle}
                        />
                      </Field>
                    </div>
                  )}

                  {/* STEP 2: Contact preferences */}
                  {step === 2 && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>Step 3 of 4</p>
                        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)' }}>
                          Preferred contact &amp; timing
                        </h2>
                        <p className="text-[14px] leading-[1.7]" style={{ color: '#62748e' }}>
                          How should we reach you to confirm your appointment? Choose your preferred method and ideal time.
                        </p>
                      </div>

                      <Field label="Preferred Contact Method" required>
                        <div className="grid grid-cols-4 gap-3 mt-1">
                          {CONTACT_METHODS.map(({ id, label, sub }) => {
                            const sel = form.contactMethod === id
                            return (
                              <button
                                key={id}
                                onClick={() => set('contactMethod', id)}
                                className="flex flex-col items-center text-center p-4 rounded-[14px] border-2 transition-all duration-200 relative"
                                style={{ borderColor: sel ? '#071e36' : '#e0e0e0', background: sel ? 'rgba(7,30,54,0.04)' : '#fff' }}
                              >
                                {sel && (
                                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#071e36' }}>
                                    <CheckIcon className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                                <div
                                  className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-2"
                                  style={{ background: sel ? 'rgba(7,30,54,0.08)' : '#f1f5f9', color: sel ? '#071e36' : '#62748e' }}
                                >
                                  {CONTACT_ICON[id]}
                                </div>
                                <p className="font-bold text-[13px] leading-tight mb-0.5" style={{ color: sel ? '#071e36' : '#171717' }}>{label}</p>
                                <p className="text-[11px]" style={{ color: '#62748e' }}>{sub}</p>
                              </button>
                            )
                          })}
                        </div>
                      </Field>

                      <Field label="Preferred Day">
                        <div className="relative">
                          <select
                            value={form.day}
                            onChange={(e) => set('day', e.target.value)}
                            className={`${inputCls} appearance-none pr-10`}
                            style={inputStyle}
                          >
                            <option value="">Select a day (flexible)</option>
                            {DAYS.map((d) => <option key={d}>{d}</option>)}
                          </select>
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#62748e' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </Field>

                      <Field label="Preferred Time Slot" required>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                          {TIME_SLOTS.map((t) => {
                            const sel = form.time === t
                            return (
                              <button
                                key={t}
                                onClick={() => set('time', t)}
                                className="py-2.5 rounded-[10px] text-[13px] font-semibold border transition-all duration-200"
                                style={{ borderColor: sel ? '#071e36' : '#e0e0e0', background: sel ? '#071e36' : '#fff', color: sel ? '#fff' : '#62748e' }}
                              >
                                {t}
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-[12px] mt-2" style={{ color: '#62748e' }}>
                          Final time will be confirmed by our team within 24 hours.
                        </p>
                      </Field>
                    </div>
                  )}

                  {/* STEP 3: Review */}
                  {step === 3 && (
                    <div className="flex flex-col gap-5">
                      <div>
                        <p className="text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>Step 4 of 4</p>
                        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)' }}>
                          Review your appointment
                        </h2>
                        <p className="text-[14px] leading-[1.7]" style={{ color: '#62748e' }}>
                          Check everything looks right. You can go back to edit any section.
                        </p>
                      </div>

                      <ReviewCard title="Service Requested" onEdit={() => goTo(0)}>
                        <ReviewRow label="Service" value={SERVICES.find(s => s.id === form.service)?.label ?? '—'} />
                      </ReviewCard>

                      <ReviewCard title="Patient Information" onEdit={() => goTo(1)}>
                        <ReviewRow label="Name"      value={`${form.firstName} ${form.lastName}`} />
                        <ReviewRow label="Age Group" value={(() => { const ag = AGE_GROUPS.find(a => a.value === form.ageGroup); return ag ? `${ag.label} ${ag.sub}` : '—' })()} />
                        <ReviewRow label="Phone"     value={form.phone || '—'} />
                        {form.email && <ReviewRow label="Email" value={form.email} />}
                      </ReviewCard>

                      <ReviewCard title="Contact & Timing Preferences" onEdit={() => goTo(2)}>
                        <ReviewRow label="Contact Method" value={CONTACT_METHODS.find(c => c.id === form.contactMethod)?.label ?? '—'} />
                        <ReviewRow label="Preferred Time"  value={form.time || '—'} />
                        {form.day && <ReviewRow label="Preferred Day" value={form.day} />}
                      </ReviewCard>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <div
                          className="mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                          style={{ borderColor: terms ? '#071e36' : '#e0e0e0', background: terms ? '#071e36' : '#fff' }}
                          onClick={() => setTerms(t => !t)}
                        >
                          {terms && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                        <p className="text-[13px] leading-[1.7]" style={{ color: '#62748e' }}>
                          I confirm that the details above are accurate and I agree to BMC's patient care terms. I understand that this is an appointment request and will be confirmed by the BMC team within 24 hours.
                        </p>
                      </label>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation footer */}
            <div
              className="flex items-center justify-between pt-6 mt-6"
              style={{ borderTop: '1px solid #f1f5f9' }}
            >
              {step > 0 ? (
                <button
                  onClick={() => goTo(step - 1)}
                  className="flex items-center gap-2 font-semibold text-[13px] transition-colors hover:text-[#071e36]"
                  style={{ color: '#62748e' }}
                >
                  <ArrowLeft /> Back
                </button>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold text-[13px] transition-colors hover:text-[#071e36]"
                  style={{ color: '#62748e' }}
                >
                  <ArrowLeft /> Back to site
                </Link>
              )}

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold tracking-[1.5px] uppercase hidden sm:block" style={{ color: '#62748e' }}>
                  Step {step + 1} of 4
                </span>
                <button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className="flex items-center gap-2 text-white font-black text-[13px] px-7 py-3 rounded-full transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: canNext() ? '#ff7518' : '#e0e0e0',
                    boxShadow: canNext() ? '0 4px 18px rgba(255,117,24,0.30)' : 'none',
                    color: canNext() ? '#fff' : '#62748e',
                  }}
                >
                  {step === 3 ? (
                    <><CheckIcon className="w-4 h-4" /> Confirm Booking</>
                  ) : (
                    <>Continue <ArrowRight /></>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
