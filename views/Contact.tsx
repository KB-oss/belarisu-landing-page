'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

/* ─── Zod Schema for validation ─── */
const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'Too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message too long'),
  inquiryType: z.enum(['Patient', 'Partnership', 'Donation', 'Volunteer', 'Media']),
})

type FormData = z.infer<typeof formSchema>

/* ─── Inquiry types with contextual hints ─── */
const INQUIRY_TABS = ['Patient', 'Partnership', 'Donation', 'Volunteer', 'Media'] as const
type InquiryTab = (typeof INQUIRY_TABS)[number]

const TAB_META: Record<InquiryTab, { placeholder: string; label: string }> = {
  Patient:     { label: "How can we help you?",         placeholder: "Tell us about yourself or your child's condition and what kind of support you're looking for..." },
  Partnership: { label: "Describe the partnership",    placeholder: "Share your organisation and the type of collaboration you have in mind..." },
  Donation:    { label: "How would you like to give?", placeholder: "Tell us about how you'd like to contribute, any specific programs, or amount you have in mind..." },
  Volunteer:   { label: "Tell us about yourself",      placeholder: "Share your background, skills, and how you'd like to support our mission..." },
  Media:       { label: "What's your story?",          placeholder: "Tell us your media organisation and the angle or story you're looking to cover..." },
}

/* ─── Contact info ─── */
interface ContactInfoItem { icon: React.ReactNode; label: string; sub: string; href?: string }

const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: (
      <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15z" />
      </svg>
    ),
    label: '+254 722 872 872',
    sub: 'Mon–Sat, 8 am – 5 pm EAT',
    href: 'tel:+254722872872',
  },
  {
    icon: (
      <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </svg>
    ),
    label: 'info@belarisumedicalcentre.org',
    sub: 'We respond within 24 hours',
    href: 'mailto:info@belarisumedicalcentre.org',
  },
  {
    icon: (
      <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Park Road, Ngara',
    sub: 'Nairobi, Kenya',
  },
]

const SOCIALS = [
  { label: 'Facebook', href: '#', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { label: 'X', href: '#', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'LinkedIn', href: '#', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
  { label: 'Instagram', href: '#', icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
]

/* ─── Field wrapper ─── */
interface FieldProps { label: string; required?: boolean; error?: string; children: React.ReactNode }
function Field({ label, required, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-semibold text-[12.5px] flex items-center gap-1" style={{ color: '#3a4a5c' }}>
        {label}
        {required && <span style={{ color: ORANGE }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] mt-0.5" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  )
}

/* ─── Shared input styles ─── */
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
export default function Contact() {
  const [activeTab,  setActiveTab]  = useState<InquiryTab>('Patient')
  const [focused,    setFocused]    = useState<string | null>(null)
  const [submitted,  setSubmitted]  = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inquiryType: 'Patient',
      message: '',
    }
  })

  // Watch message for char counter
  const message = watch('message', '')
  const maxChars = 500
  const charsLeft = maxChars - message.length

  // Update form when tab changes
  const handleTabChange = (tab: InquiryTab) => {
    setActiveTab(tab)
    setValue('inquiryType', tab)
  }

  // Submit to Web3Forms
  const onSubmit = async (data: FormData) => {
    setSubmitError(null)
    
    const formData = new FormData()
    formData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '')
    formData.append('first_name', data.firstName)
    formData.append('last_name', data.lastName)
    formData.append('email', data.email)
    formData.append('phone', data.phone || '')
    formData.append('inquiry_type', data.inquiryType)
    formData.append('message', data.message)
    
    // Optional: Add subject line
    formData.append('subject', `New ${data.inquiryType} Inquiry from ${data.firstName} ${data.lastName}`)
    
    // Optional: Redirect URL (leave empty to stay on page)
    // formData.append('redirect', window.location.href)

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
        setSubmitError(result.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className="pt-[88px]" style={{ background: '#fdfcfb', overflowX: 'clip' }}>
      <div className={`${WRAP} py-12 sm:py-16`}>
        <Reveal direction="up">
          <div
            className="rounded-[20px] overflow-hidden flex flex-col lg:flex-row"
            style={{
              boxShadow: '0 4px 60px rgba(7,30,54,0.10)',
              minHeight: '780px',
            }}
          >

            {/* ─────────────────────────────────────
                LEFT: Navy info panel (unchanged)
            ───────────────────────────────────── */}
            <div
              className="lg:w-[42%] xl:w-[40%] shrink-0 flex flex-col justify-between p-8 sm:p-10 xl:p-12 relative overflow-hidden"
              style={{ background: NAVY }}
            >
              {/* Dot grid decoration */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Accent glow */}
              <div
                className="absolute -top-32 -right-32 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,117,24,0.18) 0%, transparent 70%)' }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,117,24,0.10) 0%, transparent 70%)' }}
              />

              {/* Headline + body */}
              <div className="relative z-10 flex flex-col gap-5">
                <div>
                  <p className="font-black tracking-[3px] uppercase mb-3 text-white/40" style={{ fontSize: '10px' }}>
                    Get in Touch
                  </p>
                  <h1
                    className="font-black text-white leading-[1.05] tracking-[-0.025em]"
                    style={{ fontSize: 'clamp(1.9rem, 3vw, 3rem)' }}
                  >
                    Let&apos;s Make Every{' '}
                    <br className="hidden sm:block" />
                    Journey{' '}
                    <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                      Brighter
                    </em>
                  </h1>
                </div>
                <p className="text-[15px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.68)', maxWidth: '380px' }}>
                  Have questions, ideas, or want to partner with us? Reach out — we&apos;re here to help every step of the way.
                </p>
              </div>

              {/* Contact info cards */}
              <div className="relative z-10 flex flex-col gap-3 my-8 lg:my-0 lg:mt-auto lg:mb-8">
                {CONTACT_INFO.map(({ icon, label, sub, href }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-[14px] px-4 py-3.5 transition-colors duration-200"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 text-white"
                      style={{ background: ORANGE }}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0">
                      {href ? (
                        <a href={href} className="text-white font-bold text-[14px] leading-[1.4] hover:text-accent transition-colors truncate block">
                          {label}
                        </a>
                      ) : (
                        <p className="text-white font-bold text-[14px] leading-[1.4]">{label}</p>
                      )}
                      <p className="text-[12px] leading-[1.4]" style={{ color: 'rgba(255,255,255,0.50)' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-white/30 text-[10px] font-black tracking-[2px] uppercase mr-1">Follow</span>
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ─────────────────────────────────────
                RIGHT: Form panel with Web3Forms + Zod
            ───────────────────────────────────── */}
            <div className="flex-1 bg-white flex flex-col p-8 sm:p-10 xl:p-12 relative">

              <AnimatePresence mode="wait">

                {/* ── SUCCESS STATE ── */}
                {submitted ? (
                  <motion.div
                    key="success"
                    className="flex-1 flex flex-col items-center justify-center text-center gap-5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,117,24,0.10)' }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#ff7518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </motion.div>
                    <div>
                      <h2 className="font-black text-[#071e36] text-[24px] tracking-tight mb-2">Message Sent!</h2>
                      <p className="text-[15px] leading-[1.65]" style={{ color: '#62748e', maxWidth: '320px', margin: '0 auto' }}>
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); reset() }}
                      className="mt-2 px-6 py-2.5 rounded-full text-[13px] font-bold border border-[#e2e8f0] hover:border-[#ff7518] text-[#62748e] hover:text-[#ff7518] transition-all duration-200"
                    >
                      Send another message
                    </button>
                  </motion.div>

                ) : (
                  /* ── FORM with react-hook-form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {/* Header */}
                    <div>
                      <h2
                        className="font-black text-[#071e36] tracking-[-0.02em] mb-1"
                        style={{ fontSize: 'clamp(1.5rem, 2.2vw, 1.9rem)' }}
                      >
                        Send us a Message
                      </h2>
                      <p className="text-[14px] leading-[1.65]" style={{ color: '#62748e' }}>
                        Choose the reason for your message and fill in the form below.
                      </p>
                    </div>

                    {/* ── Sliding tab indicator ── */}
                    <div
                      className="flex gap-1.5 flex-wrap p-1 rounded-[12px]"
                      style={{ background: '#f4f6f8' }}
                    >
                      {INQUIRY_TABS.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => handleTabChange(tab)}
                          className="relative px-4 py-1.5 rounded-[9px] text-[12.5px] font-bold transition-colors duration-150 z-10"
                          style={{ color: activeTab === tab ? '#fff' : '#62748e' }}
                        >
                          {activeTab === tab && (
                            <motion.div
                              layoutId="tab-bg"
                              className="absolute inset-0 rounded-[9px]"
                              style={{ background: NAVY }}
                              transition={{ type: 'spring', stiffness: 440, damping: 36 }}
                            />
                          )}
                          <span className="relative z-10">{tab}</span>
                        </button>
                      ))}
                    </div>

                    {/* Hidden field for inquiry type */}
                    <input type="hidden" {...register('inquiryType')} />

                    {/* ── Form fields ── */}
                    <div className="flex flex-col gap-4">
                      {/* Name row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="First Name" required error={errors.firstName?.message}>
                          <input
                            {...register('firstName')}
                            placeholder="e.g. Amara"
                            className={BASE_INPUT}
                            style={useInputStyle(focused, 'firstName', !!errors.firstName)}
                            onFocus={() => setFocused('firstName')}
                            onBlur={() => setFocused(null)}
                          />
                        </Field>
                        <Field label="Last Name" required error={errors.lastName?.message}>
                          <input
                            {...register('lastName')}
                            placeholder="e.g. Tesfaye"
                            className={BASE_INPUT}
                            style={useInputStyle(focused, 'lastName', !!errors.lastName)}
                            onFocus={() => setFocused('lastName')}
                            onBlur={() => setFocused(null)}
                          />
                        </Field>
                      </div>

                      <Field label="Email Address" required error={errors.email?.message}>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="e.g. amara@email.com"
                          className={BASE_INPUT}
                          style={useInputStyle(focused, 'email', !!errors.email)}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>

                      <Field label="Phone Number" error={errors.phone?.message}>
                        <input
                          {...register('phone')}
                          type="tel"
                          placeholder="e.g. +254 711 000 000"
                          className={BASE_INPUT}
                          style={useInputStyle(focused, 'phone', !!errors.phone)}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused(null)}
                        />
                      </Field>

                      <Field label={TAB_META[activeTab].label} required error={errors.message?.message}>
                        <div className="relative">
                          <textarea
                            {...register('message')}
                            placeholder={TAB_META[activeTab].placeholder}
                            rows={4}
                            maxLength={maxChars}
                            className={`${BASE_INPUT} resize-none`}
                            style={{
                              ...useInputStyle(focused, 'message', !!errors.message),
                              paddingBottom: '2rem',
                            }}
                            onFocus={() => setFocused('message')}
                            onBlur={() => setFocused(null)}
                          />
                          {/* Char counter */}
                          <span
                            className="absolute bottom-2.5 right-3.5 text-[11px] tabular-nums pointer-events-none"
                            style={{ color: charsLeft < 50 ? '#ef4444' : '#b0bec5' }}
                          >
                            {charsLeft}
                          </span>
                        </div>
                      </Field>
                    </div>

                    {/* Error message from Web3Forms */}
                    {submitError && (
                      <div className="p-3 rounded-lg" style={{ background: '#fef2f2', color: '#dc2626' }}>
                        <p className="text-[13px] font-medium">{submitError}</p>
                      </div>
                    )}

                    {/* Submit */}
                    <div className="flex flex-col gap-3 mt-1">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2.5 text-white font-black py-[17px] rounded-[14px] text-[15px] transition-all duration-200 disabled:opacity-80"
                        style={{ background: ORANGE, boxShadow: '0 6px 20px rgba(255,117,24,0.30)' }}
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.span
                              key="loading"
                              className="flex items-center gap-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              Sending…
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              className="flex items-center gap-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              Send Message
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {/* Reassurance text */}
                      <p className="text-center text-[12px]" style={{ color: '#b0bec5' }}>
                        🔒 Your information is private and secure. We respond within 24 hours.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}