'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import DonationModal from '../components/DonationModal'

const HERO_IMG = 'https://www.figma.com/api/mcp/asset/43c860bf-569c-4c85-8fc6-e1206952b560'

interface WayItem {
  icon: string
  title: string
  text: string
}

const WAYS: WayItem[] = [
  {
    icon: 'https://www.figma.com/api/mcp/asset/edcbc255-da22-4dc5-90c4-0444d1f8f057',
    title: 'One-Time Gift',
    text: 'Make an immediate impact with a single donation. Every dollar goes directly to patient care.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/ab94f148-61f2-4104-8c7e-bffa9e203f19',
    title: 'Monthly Giving',
    text: 'Become a sustaining supporter and provide reliable funding for our programmes year-round.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/8f763915-390d-4356-a538-835ba47c65a3',
    title: 'Corporate Partnership',
    text: 'Partner with BMC as an organization. Corporate partnerships build lasting, systemic change.',
  },
]

export default function Donate() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="bg-bg">
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[500px] flex items-end overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 to-navy/85" />
        <div className="relative z-10 container-bmc pb-16">
          <p className="text-accent text-sm font-bold tracking-[3px] uppercase mb-3">Make a Difference</p>
          <h1 className="text-white font-black text-5xl md:text-6xl leading-tight tracking-tight mb-4">
            Give a Child Their<br />
            <em className="not-italic text-accent">First Smile</em>
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-8">
            Your generosity brings life-changing cleft care to those who need it most. Join us in making a profound difference.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-accent text-white font-black px-10 py-4 rounded-full hover:bg-accent-dark transition-all shadow-xl text-base"
          >
            Donate Now
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Ways to give */}
      <section className="section-pad">
        <div className="container-bmc">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-bold tracking-[3px] uppercase mb-3">Ways to Give</p>
            <h2 className="text-navy font-black text-4xl md:text-5xl leading-tight tracking-tight">
              Every Gift Makes an <em className="not-italic text-accent">Impact</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {WAYS.map(({ icon, title, text }) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-8 border border-[#e4e4e4] hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                  <img src={icon} alt="" className="w-6 h-6 object-contain" />
                </div>
                <p className="text-navy font-black text-xl mb-2">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <div className="bg-navy rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-white font-black text-4xl leading-tight tracking-tight mb-4">
              Ready to Change a Life?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Join hundreds of supporters who have helped transform the lives of children and families through comprehensive cleft care.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-accent font-black px-10 py-4 rounded-full hover:bg-accent hover:text-white transition-all shadow-xl text-base"
            >
              Make Your Donation
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && <DonationModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
