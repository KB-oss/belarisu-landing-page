'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useBookingStore } from '@/store/booking-store'
import { ServiceStep } from './steps/service-step'
import { PatientDetailsStep } from './steps/patient-details-step'
import { DoctorSelectionStep } from './steps/doctor-selection-step'
import { ConfirmationStep } from './steps/confirmation-step'

/* ─── Design tokens ─── */
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Trust badges ─── */
const TRUST = [
  'Completely free of charge',
  'Response within 24 hours',
  'Your information is private and secure',
]

/* ─── Animation ─── */
const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28, filter: 'blur(4px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -20 : 20, transition: { duration: 0.22 } }),
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

/* ═══════════════════════════════════════ */
export default function BookingPage() {
  const { currentStep, setStep } = useBookingStore()
  const [dir, setDir] = useState<number>(1)

  const STEP_LABELS = ['SERVICE', 'PATIENT', 'DOCTOR', 'REVIEW']

  const leftContent = {
    1: {
      heading: 'What brings you to BMC?',
      body: 'We offer six specialised services as part of our Comprehensive Cleft Care model. Every service is free and coordinated under one roof.',
    },
    2: {
      heading: 'Tell us about the patient',
      body: 'Your details help our care team prepare for your visit and assign the right specialist to your case before you even arrive.',
    },
    3: {
      heading: 'Choose Your Doctor & Time',
      body: 'Select your preferred doctor and schedule an appointment time that works for you.',
    },
    4: {
      heading: 'Almost there — review your details',
      body: 'Check everything looks right before we submit. Our staff will contact you within 24 hours to confirm your appointment.',
    },
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setDir(1)
      setStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDir(-1)
      setStep(currentStep - 1)
    }
  }

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
                {STEP_LABELS.map((label, i) => {
                  const stepNumber = i + 1
                  const isCompleted = stepNumber < currentStep
                  const isActive = stepNumber === currentStep
                  
                  return (
                    <div key={label} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] transition-all duration-300 shrink-0 cursor-pointer"
                          onClick={() => {
                            setDir(stepNumber > currentStep ? 1 : -1)
                            setStep(stepNumber)
                          }}
                          style={{
                            background: isCompleted ? '#ff7518' : isActive ? '#fff' : 'rgba(255,255,255,0.12)',
                            color: isCompleted ? '#fff' : isActive ? '#071e36' : 'rgba(255,255,255,0.45)',
                            boxShadow: isActive ? '0 4px 12px rgba(255,255,255,0.2)' : 'none',
                          }}
                        >
                          {isCompleted ? <CheckIcon className="w-3.5 h-3.5" /> : stepNumber}
                        </div>
                        <span
                          className="text-[10px] font-bold tracking-[1px] text-center cursor-pointer"
                          onClick={() => {
                            setDir(stepNumber > currentStep ? 1 : -1)
                            setStep(stepNumber)
                          }}
                          style={{ color: isActive ? '#fff' : isCompleted ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}
                        >
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div
                          className="flex-1 h-px mx-1 mb-5 transition-all duration-300"
                          style={{ background: isCompleted ? '#ff7518' : 'rgba(255,255,255,0.15)' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-4">
                <h2
                  className="font-black text-white leading-[1.1] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)' }}
                >
                  {leftContent[currentStep as keyof typeof leftContent]?.heading}
                </h2>
                <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {leftContent[currentStep as keyof typeof leftContent]?.body}
                </p>
                
                {/* Service list only shows on step 1 */}
                {currentStep === 1 && (
                  <div className="mt-8 grid grid-cols-2 gap-2">
                    {['Surgery', 'ENT Care', 'Orthodontics', 'Speech Therapy', 'Nutritional Support', 'Psychosocial Care'].map((service) => (
                      <div key={service} className="flex items-center gap-2 py-1.5">
                        <CircleCheckIcon className="w-4 h-4 shrink-0 text-accent-dark" />
                        <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{service}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trust signals */}
            <div className="relative z-10 flex flex-col gap-3 pt-10">
              {TRUST.map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,117,24,0.2)' }}>
                    <CheckIcon className="w-3 h-3 text-[#ff7518]"  />
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
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={currentStep}
                  custom={dir}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full"
                >
                  {currentStep === 1 && <ServiceStep onNext={handleNext} />}
                  {currentStep === 2 && <PatientDetailsStep onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 3 && <DoctorSelectionStep onNext={handleNext} onBack={handleBack} />}
                  {currentStep === 4 && <ConfirmationStep onBack={handleBack} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}