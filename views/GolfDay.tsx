'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Reveal from '../components/Reveal'
import React from 'react'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'
const NAVY = '#071e36'
const ORANGE = '#ff7518'
const BEIGE = '#f6f3ee'

const BAND_IMG = '/golf-day-banner.webp'

const PAYBILL = '4066527'
const ACCOUNT = 'SMILE'

/* ─── Zod schema ─── */
const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(80, 'Too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone number is required').max(20, 'Too long'),
  entryType: z.enum(['Single Entry — KSH 4,000', '4-Ball Team — KSH 12,000']),
  teammates: z.string().max(300, 'Too long').optional(),
  message: z.string().max(500, 'Too long').optional(),
})

type FormData = z.infer<typeof formSchema>

const ENTRY_OPTIONS = ['Single Entry — KSH 4,000', '4-Ball Team — KSH 12,000'] as const

/* ─── Icons ─── */
function ArrowRight({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function CopyIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V6a2.5 2.5 0 0 1 2.5-2.5H15" />
    </svg>
  )
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  )
}

/* ─── Copyable payment value ─── */
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const valueRef = useRef<HTMLParagraphElement>(null)

  /* Select the number as a fallback — the Clipboard API needs a secure context
     and permission, and when it's unavailable a silent no-op looks broken. */
  const selectValue = () => {
    const node = valueRef.current
    if (!node) return
    const range = document.createRange()
    range.selectNodeContents(node)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      selectValue()
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-[12px] font-semibold mb-1" style={{ color: '#62748e' }}>{label}</p>
        <p ref={valueRef} className="font-black text-[24px] sm:text-[28px] leading-none tracking-tight" style={{ color: NAVY }}>{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label} ${value}`}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          borderColor: copied ? ORANGE : '#dcd6cc',
          color: copied ? ORANGE : '#62748e',
          outlineColor: ORANGE,
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

/* ─── Form field wrapper (matches Contact.tsx) ─── */
interface FieldProps { label: string; required?: boolean; error?: string; children: React.ReactNode }
function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold text-[12.5px] flex items-center gap-1" style={{ color: '#3a4a5c' }}>
        {label}
        {required && <span style={{ color: ORANGE }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] mt-0.5" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

function getInputStyle(focused: string | null, fieldId: string, hasError?: boolean) {
  const isFocused = focused === fieldId
  return {
    borderColor: hasError ? '#ef4444' : (isFocused ? ORANGE : '#e2e8f0'),
    boxShadow: isFocused ? `0 0 0 3px rgba(255,117,24,0.14)` : 'none',
    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
    color: '#171717',
  }
}

const BASE_INPUT = 'border rounded-[10px] px-4 py-3 text-[14px] outline-none bg-white w-full'

/* Lenis (components/SmoothScroll.tsx) intercepts wheel scrolling, which stops
   native `href="#…"` jumps from landing. Drive it directly when it's running. */
function scrollToRegister(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('register')
  if (!target) return
  e.preventDefault()
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -110 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

/* ═══════════════════════════════════════ */
export default function GolfDay() {
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { entryType: 'Single Entry — KSH 4,000' },
  })

  const entryType = watch('entryType')

  const onSubmit = async (data: FormData) => {
    setSubmitError(null)

    const formData = new FormData()
    formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '')
    formData.append('full_name', data.fullName)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('entry_type', data.entryType)
    formData.append('teammates', data.teammates || '')
    formData.append('message', data.message || '')
    formData.append('subject', `Swing For Smiles registration from ${data.fullName}`)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      if (result.success) {
        setSubmitted(true)
        reset()
      } else {
        setSubmitError(result.message || 'Failed to send your registration. Please try again.')
      }
    } catch (error) {
      console.error('Golf registration submission error:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div style={{ background: '#fdfcfb' }}>

      {/* ══════════════════════════════════
          HERO — headline left, entry card right
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 75% 60% at 78% 0%, rgba(255,117,24,0.13) 0%, transparent 62%)' }}
        />
        <div className={`${WRAP} relative pt-[124px] pb-16 lg:pt-[150px] lg:pb-24`}>
          <Reveal direction="up">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">

              {/* Headline */}
              <div>
                <p className="text-sm font-bold tracking-[3px] uppercase mb-5" style={{ color: ORANGE }}>
                  Swing For Smiles
                </p>
                <h1 className="text-white font-black leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(2.7rem, 5.6vw, 4.8rem)' }}>
                  Charity Golf<br />
                  <em className="not-italic" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: ORANGE }}>Tournament.</em>
                </h1>
                <p className="text-lg max-w-[46ch] font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>
                  Play the course. Lead the change. Every entry funds cleft surgery, therapy and follow-up
                  care at BelaRisu Medical Centre.
                </p>
              </div>

              {/* Entry card */}
              <div
                className="rounded-[22px] overflow-hidden backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.13)' }}
              >
                {/* Date */}
                <div className="flex items-center gap-5 px-6 sm:px-8 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.11)' }}>
                  <p className="font-black text-white leading-none tracking-tighter" style={{ fontSize: 'clamp(3.2rem, 6vw, 4.2rem)' }}>02</p>
                  <div className="pt-1">
                    <p className="text-white font-black text-[17px] leading-tight">October 2026</p>
                    <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>World Smile Day</p>
                  </div>
                </div>

                {/* Vitals */}
                <dl className="px-6 sm:px-8">
                  <div className="flex items-start justify-between gap-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
                    <dt className="text-[13px] shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>Venue</dt>
                    <dd className="text-right">
                      <span className="block text-white font-bold text-[14px]">Karen Country Club</span>
                      <span className="block text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Nairobi, Kenya</span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
                    <dt className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Single entry</dt>
                    <dd className="font-black text-[19px] tracking-tight" style={{ color: ORANGE }}>KSH 4,000</dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 py-4">
                    <dt className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>4-ball team</dt>
                    <dd className="font-black text-[19px] tracking-tight" style={{ color: ORANGE }}>KSH 12,000</dd>
                  </div>
                </dl>

                {/* CTA */}
                <div className="px-6 sm:px-8 pb-7 pt-2">
                  <a
                    href="#register"
                    onClick={scrollToRegister}
                    className="flex items-center justify-center gap-2 w-full font-black py-4 rounded-full text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ background: ORANGE, color: '#fff', outlineColor: '#fff' }}
                  >
                    Register to play
                    <ArrowRight />
                  </a>
                  <p className="text-center text-[11.5px] mt-3.5" style={{ color: 'rgba(255,255,255,0.42)' }}>
                    Pay by M-PESA once your entry is confirmed
                  </p>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          IMAGE BAND
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <img
          src={BAND_IMG}
          alt=""
          /* The source is 4:3. Any mobile height much over ~300px makes object-cover
             crop sideways and lose the ball, which is the only golf cue in frame. */
          className="w-full h-[300px] sm:h-[480px] lg:h-[560px] object-cover"
          /* X only bites under ~400px wide, where the 4:3 source overflows by 25px;
             anchoring right keeps the ball in frame. Wider viewports don't crop at all. */
          style={{ objectPosition: '100% 68%' }}
        />
        {/* Darkens the left for the copy and leaves the ball on the right clear. */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(7,30,54,0.92) 0%, rgba(7,30,54,0.78) 32%, rgba(7,30,54,0.38) 62%, rgba(7,30,54,0.05) 88%)' }}
        />
        <div className={`${WRAP} absolute inset-0 flex items-center`}>
          {/* The backdrop is a photo, so the gradient alone can't guarantee contrast
              against local highlights — the scrim covers the bright specks. */}
          <div className="max-w-[520px]" style={{ textShadow: '0 1px 16px rgba(7,30,54,0.92)' }}>
            <p
              className="text-white font-black leading-[1.06] tracking-tight max-w-[15ch]"
              style={{ fontSize: 'clamp(1.6rem, 4.4vw, 3.6rem)' }}
            >
              A round of golf pays for a lifetime of smiles.
            </p>

            {/* Same ruled-row device as the hero entry card. Figures are the ones
                the site already publishes on the home page. */}
            {/* Hidden on phones: the headline, both figures and the ball can't share
                375px without colliding, and the band's job here is the line. */}
            <dl className="hidden sm:block mt-9">
              {[
                { value: '700+', label: 'Children treated since 2022' },
                { value: '100%', label: 'Free of charge, always' },
              ].map(({ value, label }) => (
                <div
                  key={value}
                  className="flex items-baseline gap-5 py-3.5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.22)' }}
                >
                  <dt className="font-black tracking-tight shrink-0 w-[3.6em]" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', color: ORANGE }}>
                    {value}
                  </dt>
                  <dd className="text-white font-semibold text-[15px] leading-snug">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          REGISTRATION
      ══════════════════════════════════ */}
      <section id="register" className="py-20 lg:py-28 scroll-mt-24">
        <div className={`${WRAP} grid lg:grid-cols-[0.62fr_1fr] gap-12 lg:gap-20 items-start`}>

          <Reveal direction="up">
            <div className="lg:sticky lg:top-28">
              <p className="font-black tracking-[2.5px] uppercase mb-4" style={{ fontSize: '10px', color: ORANGE }}>Registration</p>
              <h2 className="font-black leading-[1.02] tracking-tight mb-5" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)', color: NAVY }}>
                Save your spot.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[40ch] mb-8" style={{ color: '#62748e' }}>
                Tell us who&rsquo;s playing. We&rsquo;ll confirm your entry by phone or email and send you
                the M-PESA details to complete it.
              </p>
              <div className="pt-7 space-y-3" style={{ borderTop: '1px solid #e8e2d8' }}>
                <p className="text-[13px]" style={{ color: '#62748e' }}>
                  Prefer to talk it through?
                </p>
                <p className="text-[14px] font-bold" style={{ color: NAVY }}>
                  <a href="tel:+254722872872" className="hover:text-accent transition-colors">0722 872 872</a>
                </p>
                <p className="text-[14px] font-bold break-all" style={{ color: NAVY }}>
                  <a href="mailto:info@belarisumedicalcentre.org" className="hover:text-accent transition-colors">info@belarisumedicalcentre.org</a>
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up">
            {submitted ? (
              <div className="rounded-[22px] p-8 sm:p-10" style={{ background: BEIGE }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ background: ORANGE, color: '#fff' }}>
                  <CheckIcon className="w-5 h-5" />
                </div>
                <p className="font-black text-[22px] tracking-tight mb-2.5" style={{ color: NAVY }}>Registration received.</p>
                <p className="text-[14px] leading-relaxed mb-7" style={{ color: '#62748e' }}>
                  Thank you for joining Swing For Smiles. Pay your entry fee by M-PESA to confirm your tee time —
                  our team will be in touch either way.
                </p>
                <div className="rounded-[16px] bg-white px-6 divide-y divide-[#f0ebe3]">
                  <CopyField label="M-PESA Paybill" value={PAYBILL} />
                  <CopyField label="Account number" value={ACCOUNT} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
                <Field label="Full name" required error={errors.fullName?.message}>
                  <input
                    {...register('fullName')}
                    className={BASE_INPUT}
                    style={getInputStyle(focused, 'fullName', !!errors.fullName)}
                    onFocus={() => setFocused('fullName')}
                    onBlur={() => setFocused(null)}
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email address" required error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    className={BASE_INPUT}
                    style={getInputStyle(focused, 'email', !!errors.email)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="jane@example.com"
                  />
                </Field>
                <Field label="Phone number" required error={errors.phone?.message}>
                  <input
                    {...register('phone')}
                    type="tel"
                    className={BASE_INPUT}
                    style={getInputStyle(focused, 'phone', !!errors.phone)}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    placeholder="0712 345 678"
                  />
                </Field>
                <Field label="Entry type" required error={errors.entryType?.message}>
                  <select
                    {...register('entryType')}
                    className={BASE_INPUT}
                    style={getInputStyle(focused, 'entryType', !!errors.entryType)}
                    onFocus={() => setFocused('entryType')}
                    onBlur={() => setFocused(null)}
                  >
                    {ENTRY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                {entryType === '4-Ball Team — KSH 12,000' && (
                  <div className="sm:col-span-2">
                    <Field label="Your three teammates" error={errors.teammates?.message}>
                      <textarea
                        {...register('teammates')}
                        className={BASE_INPUT}
                        style={getInputStyle(focused, 'teammates', !!errors.teammates)}
                        onFocus={() => setFocused('teammates')}
                        onBlur={() => setFocused(null)}
                        rows={2}
                        placeholder="Names of the other three players in your 4-ball"
                      />
                    </Field>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <Field label="Anything else we should know" error={errors.message?.message}>
                    <textarea
                      {...register('message')}
                      className={BASE_INPUT}
                      style={getInputStyle(focused, 'message', !!errors.message)}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      rows={4}
                      placeholder="Handicap, dietary needs, accessibility requirements…"
                    />
                  </Field>
                </div>
                {submitError && (
                  <p className="sm:col-span-2 text-[12.5px] rounded-[10px] px-4 py-3" style={{ color: '#b91c1c', background: '#fef2f2' }}>
                    {submitError}
                  </p>
                )}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 font-black px-8 py-4 rounded-full text-[14px] transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ background: NAVY, color: '#fff', outlineColor: ORANGE }}
                  >
                    {isSubmitting ? 'Sending…' : 'Send registration'}
                    <ArrowRight />
                  </button>
                  <p className="text-[12px]" style={{ color: '#62748e' }}>No payment needed yet.</p>
                </div>
              </form>
            )}
          </Reveal>

        </div>
      </section>

      {/* ══════════════════════════════════
          HOW TO PAY
      ══════════════════════════════════ */}
      <section className="py-16 lg:py-20" style={{ background: BEIGE }}>
        <div className={WRAP}>
          <Reveal direction="up">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <div>
                <p className="font-black tracking-[2.5px] uppercase mb-4" style={{ fontSize: '10px', color: ORANGE }}>Payment</p>
                <h2 className="font-black leading-[1.05] tracking-tight mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: NAVY }}>
                  Pay your entry by <span className="whitespace-nowrap">M-PESA</span>.
                </h2>
                <p className="text-[15px] leading-relaxed max-w-[42ch]" style={{ color: '#62748e' }}>
                  Send KSH 4,000 for a single entry, or KSH 12,000 for a 4-ball team, to the BelaRisu
                  paybill below. Keep your confirmation message — it&rsquo;s your proof of entry on the day.
                </p>
              </div>

              <div className="rounded-[22px] bg-white p-7 sm:p-8" style={{ border: '1px solid #ece6dc' }}>
                <div className="flex items-center gap-3 mb-2 pb-5" style={{ borderBottom: '1px solid #f0ebe3' }}>
                  <img src="/mpesaLogo.png" alt="M-PESA" className="h-7 w-auto object-contain" />
                </div>
                <div className="divide-y divide-[#f0ebe3]">
                  <CopyField label="Paybill number" value={PAYBILL} />
                  <CopyField label="Account number" value={ACCOUNT} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          CAN'T PLAY?
      ══════════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className={WRAP}>
          <Reveal direction="up">
            <div className="rounded-[24px] px-8 py-12 sm:px-14 sm:py-16 lg:px-20" style={{ background: NAVY }}>
              <h2 className="font-black text-white leading-[1.1] tracking-tight mb-4" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)' }}>
                Not a golfer? You can still{' '}
                <em className="not-italic" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: ORANGE }}>change a life</em>.
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[46ch] mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Sponsor a hole, donate a prize, or give directly — every contribution funds cleft surgery,
                therapy and follow-up care.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-white text-accent font-black text-[14px] px-8 py-4 rounded-full transition-colors hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: ORANGE }}
              >
                Donate instead
                <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
