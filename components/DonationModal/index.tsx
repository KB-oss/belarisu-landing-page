'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GiveOnce from './GiveOnce'
import CardForm from './CardForm'
import MpesaForm from './MpesaForm'
import DonationSuccess from './DonationSuccess'

const PANEL_IMG = 'https://www.figma.com/api/mcp/asset/43c860bf-569c-4c85-8fc6-e1206952b560'

const FAQ_LINKS = [
  'Is my donation secure?',
  'Is this donation tax-deductible?',
  'Can I cancel my recurring donation?',
]

type ModalState = 'amount' | 'card' | 'mpesa' | 'success'
type TabType = 'once' | 'monthly'
type PayMethod = 'card' | 'mpesa'

interface DonationModalProps {
  onClose: () => void
}

export default function DonationModal({ onClose }: DonationModalProps) {
  const [state, setState] = useState<ModalState>('amount')
  const [tab, setTab] = useState<TabType>('once')
  const [amount, setAmount] = useState<number>(100)
  const [payMethod, setPayMethod] = useState<PayMethod>('card')

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleDonate = () => {
    setState(payMethod === 'card' ? 'card' : 'mpesa')
  }
  const handleSubmit = () => setState('success')

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,30,54,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="relative w-full max-w-[940px] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/60 hover:text-white bg-black/20 rounded-full p-1.5"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex">
          {/* Left panel — persistent image */}
          <div className="hidden md:flex relative w-[360px] shrink-0 min-h-[540px]">
            <img src={PANEL_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 rounded-none" />
            <div
              className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 px-6 py-8 rounded-bl-2xl"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 60%, transparent)' }}
            >
              <p className="text-white font-black text-[32px] leading-tight tracking-tight">
                Give a Child Their <em className="not-italic text-accent">First Smile</em>
              </p>
              <p className="text-white/85 text-sm italic leading-relaxed">
                "The care we couldn't afford was made possible because someone, somewhere chose to give."
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 bg-white/95 backdrop-blur-md flex flex-col min-h-[540px] overflow-hidden">
            <AnimatePresence mode="wait">
              {state === 'amount' && (
                <motion.div key="amount" className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}>
                  <GiveOnce
                    tab={tab} setTab={setTab}
                    amount={amount} setAmount={setAmount}
                    payMethod={payMethod} setPayMethod={setPayMethod}
                    onDonate={handleDonate}
                  />
                </motion.div>
              )}
              {state === 'card' && (
                <motion.div key="card" className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}>
                  <CardForm amount={amount} onBack={() => setState('amount')} onSubmit={handleSubmit} />
                </motion.div>
              )}
              {state === 'mpesa' && (
                <motion.div key="mpesa" className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}>
                  <MpesaForm amount={amount} onBack={() => setState('amount')} onSubmit={handleSubmit} />
                </motion.div>
              )}
              {state === 'success' && (
                <motion.div key="success" className="flex flex-col flex-1"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}>
                  <DonationSuccess onClose={onClose} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FAQ footer */}
        <div className="bg-navy flex items-center justify-center gap-6 py-3 flex-wrap">
          {FAQ_LINKS.map((q) => (
            <button key={q} className="text-white/60 text-xs hover:text-white transition-colors">
              {q}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
