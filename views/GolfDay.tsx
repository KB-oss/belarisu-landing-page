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

const CLD = 'https://res.cloudinary.com/dtqbzj2sg/image/upload'
const BANNER = 'v1788900416/belarisu/golf-day/golf-day-banner.webp'

/* The ball sits far right in the source and is the only golf cue in frame.
   g_auto holds it in landscape crops but drops it from portrait ones, so
   narrow screens anchor east instead. */
const HERO_WIDE = `${CLD}/f_auto,q_auto,c_fill,g_auto,ar_21:9,w_2000/${BANNER}`
const HERO_MID = `${CLD}/f_auto,q_auto,c_fill,g_auto,ar_16:9,w_1400/${BANNER}`
const HERO_TALL = `${CLD}/f_auto,q_auto,c_fill,g_east,ar_4:5,w_900/${BANNER}`

const PAYBILL = '4066527'
const ACCOUNT = 'SMILE'

const ENTRY_TIERS = [
  { value: 'Single Entry — KSH 4,000' as const, name: 'Single entry', price: 'KSH 4,000', detail: 'One player' },
  { value: '4-Ball Team — KSH 12,000' as const, name: '4-ball team', price: 'KSH 12,000', detail: 'Four players — best value' },
]

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
          HERO — the photograph is the banner
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        <picture>
          <source media="(min-width: 1024px)" srcSet={HERO_WIDE} />
          <source media="(min-width: 640px)" srcSet={HERO_MID} />
          <img src={HERO_TALL} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </picture>

        {/* Two scrims, because the copy sits over different parts of the frame at
            each size: stacked under the headline on mobile, beside the ball on desktop. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: 'linear-gradient(to bottom, rgba(7,30,54,0.90) 0%, rgba(7,30,54,0.62) 42%, rgba(7,30,54,0.88) 100%)' }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(to right, rgba(7,30,54,0.94) 0%, rgba(7,30,54,0.80) 38%, rgba(7,30,54,0.32) 68%, rgba(7,30,54,0.10) 100%)' }}
        />

        {/* The site-wide floating donate button is pinned bottom-right, so the meta
            strip needs bottom padding or its last column sits underneath it. */}
        <div className={`${WRAP} relative pt-[124px] pb-24 lg:pt-[168px] lg:pb-28`}>
          <Reveal direction="up">
            {/* px, not ch — a ch cap here resolves against the 16px parent, not the
                74px headline, and folds the title onto three lines. */}
            <div className="max-w-[560px] lg:max-w-[680px]">
              <p className="text-[12px] sm:text-sm font-bold tracking-[3px] uppercase mb-5" style={{ color: ORANGE }}>
                Swing For Smiles
              </p>
              <h1 className="text-white font-black leading-[0.95] tracking-tight mb-6" style={{ fontSize: 'clamp(2.6rem, 5.8vw, 5rem)' }}>
                Charity Golf<br />
                <em className="not-italic" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: ORANGE }}>Tournament.</em>
              </h1>
              <p className="text-base sm:text-lg font-light leading-relaxed mb-9 max-w-[46ch]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                Play the course. Lead the change. Every entry funds cleft surgery, therapy and follow-up
                care at BelaRisu Medical Centre.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="#register"
                  onClick={scrollToRegister}
                  className="inline-flex items-center justify-center gap-2 font-black px-8 py-4 rounded-full text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: ORANGE, color: '#fff', outlineColor: '#fff' }}
                >
                  Register to play
                  <ArrowRight />
                </a>
                <p className="text-[12.5px]" style={{ color: 'rgba(255,255,255,0.62)' }}>
                  Pay by M-PESA once confirmed
                </p>
              </div>
            </div>
          </Reveal>

          {/* Meta strip — the event's four facts, on one rule at the foot of the banner */}
          <dl className="relative mt-14 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-6 py-7 lg:py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.22)' }}>
            {[
              { term: 'Date', value: '02 October 2026', sub: 'World Smile Day' },
              { term: 'Venue', value: 'Karen Country Club', sub: 'Nairobi, Kenya' },
              { term: 'Single entry', value: 'KSH 4,000', sub: 'One player' },
              { term: '4-ball team', value: 'KSH 12,000', sub: 'Four players' },
            ].map(item => (
              <div key={item.term}>
                <dt className="text-[10.5px] font-bold tracking-[2px] uppercase mb-2.5" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  {item.term}
                </dt>
                <dd>
                  <span className="block text-white font-black text-[15px] sm:text-[17px] leading-tight tracking-tight">{item.value}</span>
                  <span className="block text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.sub}</span>
                </dd>
              </div>
            ))}
          </dl>
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
                {/* Entry tier — cards rather than a select, so both prices are
                    visible as a choice instead of hidden behind a dropdown. */}
                <fieldset className="sm:col-span-2">
                  <legend className="font-semibold text-[12.5px] flex items-center gap-1 mb-2.5" style={{ color: '#3a4a5c' }}>
                    Entry type
                    <span style={{ color: ORANGE }}>*</span>
                  </legend>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ENTRY_TIERS.map(tier => {
                      const isSelected = entryType === tier.value
                      return (
                        <label
                          key={tier.value}
                          className="cursor-pointer rounded-[10px] border px-5 py-4 flex items-start gap-3.5 transition-colors focus-within:outline-2 focus-within:outline-offset-2"
                          style={{
                            borderColor: isSelected ? ORANGE : '#e2e8f0',
                            background: isSelected ? 'rgba(255,117,24,0.05)' : '#fff',
                            outlineColor: ORANGE,
                          }}
                        >
                          <input
                            type="radio"
                            value={tier.value}
                            {...register('entryType')}
                            className="sr-only"
                          />
                          <span
                            className="mt-1 shrink-0 w-[17px] h-[17px] rounded-full border flex items-center justify-center transition-colors"
                            style={{ borderColor: isSelected ? ORANGE : '#cbd5e1' }}
                            aria-hidden="true"
                          >
                            {isSelected && <span className="w-[9px] h-[9px] rounded-full" style={{ background: ORANGE }} />}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-black text-[20px] leading-none tracking-tight mb-1.5" style={{ color: isSelected ? ORANGE : NAVY }}>
                              {tier.price}
                            </span>
                            <span className="block font-bold text-[13px] leading-tight" style={{ color: NAVY }}>{tier.name}</span>
                            <span className="block text-[12px] mt-0.5" style={{ color: '#62748e' }}>{tier.detail}</span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.entryType?.message && (
                    <p className="text-[11px] mt-1.5" style={{ color: '#ef4444' }}>{errors.entryType.message}</p>
                  )}
                </fieldset>

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
                <div className="sm:col-span-2">
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
                </div>
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
