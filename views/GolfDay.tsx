'use client'

import { useState } from 'react'
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

/* ─── Field wrapper (matches Contact.tsx) ─── */
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

function useInputStyle(focused: string | null, fieldId: string, hasError?: boolean) {
  const isFocused = focused === fieldId
  return {
    borderColor: hasError ? '#ef4444' : (isFocused ? ORANGE : '#e2e8f0'),
    boxShadow: isFocused ? `0 0 0 3px rgba(255,117,24,0.14)` : 'none',
    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
    color: '#171717',
  }
}

const BASE_INPUT = 'border rounded-[10px] px-4 py-3 text-[14px] outline-none bg-white w-full'

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
    <div className="bg-[#fdfcfb]">

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(255,117,24,0.10) 0%, transparent 65%)' }}
        />
        <div className={`${WRAP} relative pt-[132px] pb-16 lg:pt-[160px] lg:pb-20`}>
          <Reveal direction="up">
            <p className="text-accent text-sm font-bold tracking-[3px] uppercase mb-4" style={{ color: ORANGE }}>
              Swing For Smiles
            </p>
            <h1 className="text-white font-black leading-[0.98] tracking-tight mb-5" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}>
              Charity Golf<br />
              <em className="not-italic" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: ORANGE }}>Tournament.</em>
            </h1>
            <p className="text-white/78 text-lg max-w-xl mb-9 font-light leading-relaxed">
              Play the course. Lead the change. All proceeds directly support cleft care at BelaRisu Medical Centre.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-5 mb-9">
              {[
                { label: '02 Oct 2026', sub: 'World Smile Day' },
                { label: 'Karen Country Club', sub: 'Nairobi, Kenya' },
                { label: 'KSH 4,000 / KSH 12,000', sub: 'Single entry / 4-ball' },
              ].map(({ label, sub }) => (
                <div key={label}>
                  <p className="text-white font-bold text-[15px]">{label}</p>
                  <p className="text-white/50 text-[11px] uppercase tracking-[1.5px] font-black mt-1">{sub}</p>
                </div>
              ))}
            </div>
            <a
              href="#register"
              className="inline-flex items-center gap-2 font-black px-8 py-3.5 rounded-full transition-all shadow-xl text-sm"
              style={{ background: ORANGE, color: '#fff' }}
            >
              Register to play
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRICING / PAYMENT
      ══════════════════════════════════ */}
      <section className="py-14 lg:py-16" style={{ background: '#f6f3ee' }}>
        <div className={WRAP}>
          <Reveal direction="up">
            <div className="grid sm:grid-cols-3 gap-8">
              <div>
                <p className="font-black tracking-[2.5px] uppercase mb-4" style={{ fontSize: '10px', color: ORANGE }}>Pricing</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2"><strong className="text-lg" style={{ color: ORANGE }}>KSH 4,000</strong><span className="text-[13px] text-muted">Single entry</span></div>
                  <div className="flex items-baseline gap-2"><strong className="text-lg" style={{ color: ORANGE }}>KSH 12,000</strong><span className="text-[13px] text-muted">4-ball (team of 4)</span></div>
                </div>
              </div>
              <div>
                <p className="font-black tracking-[2.5px] uppercase mb-4" style={{ fontSize: '10px', color: ORANGE }}>M-PESA Payment</p>
                <p className="font-bold text-navy" style={{ color: NAVY }}>Paybill 4066527</p>
                <p className="text-muted text-[13px] mt-1">Account: SMILE</p>
              </div>
              <div>
                <p className="font-black tracking-[2.5px] uppercase mb-4" style={{ fontSize: '10px', color: ORANGE }}>Questions</p>
                <p className="text-[14px] font-semibold" style={{ color: NAVY }}>
                  <a href="tel:+254722872872" className="hover:text-accent">0722 872 872</a>
                  {' · '}
                  <a href="mailto:info@belarisumedicalcentre.org" className="hover:text-accent">info@belarisumedicalcentre.org</a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          REGISTRATION FORM
      ══════════════════════════════════ */}
      <section id="register" className="section-pad">
        <div className={`${WRAP} grid lg:grid-cols-[0.55fr_1fr] gap-12 lg:gap-20`}>
          <Reveal direction="up">
            <p className="font-black tracking-[2.5px] uppercase mb-4" style={{ fontSize: '10px', color: ORANGE }}>Registration</p>
            <h2 className="font-black leading-[1.05] tracking-tight mb-4" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 3rem)', color: NAVY }}>
              Save your spot.
            </h2>
            <p className="text-muted text-[15px] leading-relaxed max-w-[38ch]">
              Fill in your details below. Our team will confirm your entry and share M-PESA payment instructions to complete registration.
            </p>
          </Reveal>

          <Reveal direction="up">
            {submitted ? (
              <div className="rounded-3xl p-8" style={{ background: '#f6f3ee' }}>
                <strong className="text-xl" style={{ color: NAVY }}>Registration received.</strong>
                <p className="mt-2.5 text-muted text-[14px] leading-relaxed">
                  Thank you for joining Swing For Smiles. Pay your entry fee via M-PESA Paybill <strong>4066527</strong>, Account <strong>SMILE</strong>, and our team will confirm your tee time. Questions? Call{' '}
                  <a href="tel:+254722872872" className="hover:text-accent" style={{ color: NAVY }}>0722 872 872</a> or email{' '}
                  <a href="mailto:info@belarisumedicalcentre.org" className="hover:text-accent" style={{ color: NAVY }}>info@belarisumedicalcentre.org</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
                <Field label="Full name" required error={errors.fullName?.message}>
                  <input
                    {...register('fullName')}
                    className={BASE_INPUT}
                    style={useInputStyle(focused, 'fullName', !!errors.fullName)}
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
                    style={useInputStyle(focused, 'email', !!errors.email)}
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
                    style={useInputStyle(focused, 'phone', !!errors.phone)}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    placeholder="0712 345 678"
                  />
                </Field>
                <Field label="Entry type" required error={errors.entryType?.message}>
                  <select
                    {...register('entryType')}
                    className={BASE_INPUT}
                    style={useInputStyle(focused, 'entryType', !!errors.entryType)}
                    onFocus={() => setFocused('entryType')}
                    onBlur={() => setFocused(null)}
                  >
                    {ENTRY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                {entryType === '4-Ball Team — KSH 12,000' && (
                  <div className="sm:col-span-2">
                    <Field label="Teammates" error={errors.teammates?.message}>
                      <textarea
                        {...register('teammates')}
                        className={BASE_INPUT}
                        style={useInputStyle(focused, 'teammates', !!errors.teammates)}
                        onFocus={() => setFocused('teammates')}
                        onBlur={() => setFocused(null)}
                        rows={2}
                        placeholder="List your 3 fellow players…"
                      />
                    </Field>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <Field label="Message" error={errors.message?.message}>
                    <textarea
                      {...register('message')}
                      className={BASE_INPUT}
                      style={useInputStyle(focused, 'message', !!errors.message)}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      rows={4}
                      placeholder="Handicap, dietary needs, or anything else we should know…"
                    />
                  </Field>
                </div>
                {submitError && <p className="sm:col-span-2 text-[12px]" style={{ color: '#ef4444' }}>{submitError}</p>}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 font-black px-8 py-3.5 rounded-full transition-all shadow-xl text-sm disabled:opacity-60"
                    style={{ background: NAVY, color: '#fff' }}
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit registration'}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          CAN'T PLAY?
      ══════════════════════════════════ */}
      <Reveal direction="up">
        <section className="py-8 sm:py-10 lg:py-14">
          <div className={WRAP}>
            <div className="rounded-[24px] p-10 sm:p-12 lg:p-16 text-center" style={{ background: 'linear-gradient(145deg, #9a3208, #ff7518)' }}>
              <p className="font-black uppercase tracking-[3px] mb-4 text-white/85" style={{ fontSize: '10px' }}>Can&rsquo;t play?</p>
              <h2 className="font-black text-white leading-tight tracking-tight mb-4" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                Support the tournament another way.
              </h2>
              <p className="text-white/85 text-[15px] max-w-xl mx-auto mb-8 leading-relaxed">
                Sponsor a hole, donate a prize, or give directly — every contribution funds cleft surgery, therapy, and follow-up care.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-white font-black text-[13px] px-8 py-3.5 rounded-full hover:bg-navy hover:text-white transition-all shadow-xl"
                style={{ color: ORANGE }}
              >
                Donate instead
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  )
}
