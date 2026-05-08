'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO_URL = 'https://www.figma.com/api/mcp/asset/97ca07b3-9988-45ae-aa10-aed6be6beeb2'

const navLinks = ['Home', 'About Us', 'Services', 'Gallery', 'Donate', 'Contact']
const serviceLinks = ['Cleft Surgery', 'Orthodontics', 'Speech Therapy', 'Nutrition', 'Psychosocial', 'ENT Care']
const navPaths: Record<string, string> = { 'Home': '/', 'About Us': '/about', 'Services': '/services', 'Gallery': '/gallery', 'Donate': '/donate', 'Contact': '/contact' }
const servicePaths: Record<string, string> = { 'Cleft Surgery': '/services', 'Orthodontics': '/services', 'Speech Therapy': '/services', 'Nutrition': '/services', 'Psychosocial': '/services', 'ENT Care': '/services' }

const SOCIALS = [
  { label: 'Facebook', href: '#', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { label: 'X / Twitter', href: '#', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'LinkedIn', href: '#', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
  { label: 'Instagram', href: '#', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
]

interface ContactItem { icon: React.ReactNode; text: string; href?: string }

function ChevronDown({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <path d="M3 6l5 5 5-5" />
    </motion.svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

/* ── Accordion section (mobile only) ── */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-white font-bold text-[14px]">{title}</span>
        <ChevronDown open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Footer() {
  const contactItems: ContactItem[] = [
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, text: 'Park Road, Ngara, Nairobi, Kenya' },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 5.55 5.55l.95-.95a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, text: '+254 722 872 872', href: 'tel:+254722872872' },
    { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, text: 'info@belarisumedicalcentre.org', href: 'mailto:info@belarisumedicalcentre.org' },
  ]

  return (
    <footer className="sm:px-5">
      <div className="container-bmc py-8 sm:py-10">
        <div className="bg-navy rounded-3xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden relative">

          {/* ══ MOBILE layout (< lg) ══ */}
          <div className="lg:hidden px-6 pt-8 pb-2">

            {/* Brand block */}
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-4">
                <img src={LOGO_URL} alt="BMC" className="h-10 w-auto object-contain" />
                <div className="flex flex-col leading-none">
                  <span className="text-[16px] font-black text-white tracking-tight">BelaRisu</span>
                  <span className="text-[9px] tracking-[2.5px] uppercase text-white/50 font-medium">Medical Centre</span>
                </div>
              </div>
              <p className="text-white/70 text-[14px] leading-[1.65] mb-5 max-w-sm">
                A state-of-the-art healthcare facility delivering free, comprehensive care for every stage of life.
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-accent text-white text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-accent-dark transition-colors"
                style={{ boxShadow: '0 4px 14px rgba(255,117,24,0.30)' }}
              >
                Support Our Mission <ArrowRightIcon />
              </Link>
            </div>

            {/* Accordion link sections */}
            <div className="border-t border-white/10">
              <AccordionSection title="Navigate">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {navLinks.map(label => (
                    <li key={label}>
                      <Link href={navPaths[label]} className="text-white/65 text-[13.5px] hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection title="Our Services">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {serviceLinks.map(label => (
                    <li key={label}>
                      <Link href={servicePaths[label]} className="text-white/65 text-[13.5px] hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection title="Contact Us">
                <div className="flex flex-col gap-3">
                  {contactItems.map(({ icon, text, href }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                        {icon}
                      </div>
                      {href ? (
                        <a href={href} className="text-white/80 text-[13px] hover:text-white transition-colors">{text}</a>
                      ) : (
                        <span className="text-white/80 text-[13px]">{text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>

            {/* Social icons */}
            <div className="py-5 flex items-center justify-between">
              <span className="text-white/40 text-[11px] font-bold tracking-[2px] uppercase">Socials</span>
              <div className="flex gap-2">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/08 flex items-center justify-center text-white/70 hover:bg-accent/25 hover:text-white transition-all duration-200"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ══ DESKTOP layout (≥ lg) ══ */}
          <div className="hidden lg:block p-10 xl:p-12">
            <div className="flex items-start justify-between gap-8 flex-wrap">

              {/* Brand */}
              <div className="w-72 xl:w-80 shrink-0">
                <div className="flex items-center gap-3 mb-5">
                  <img src={LOGO_URL} alt="BMC" className="h-12 w-auto object-contain" />
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black text-white tracking-tight">BelaRisu</span>
                    <span className="text-[10px] tracking-[2.5px] uppercase text-white/50 font-medium">Medical Centre</span>
                  </div>
                </div>
                <p className="text-white/75 text-[14.5px] leading-relaxed mb-5">
                  A state-of-the-art healthcare facility delivering free, comprehensive care for every stage of life.
                </p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 bg-accent text-white text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-accent-dark transition-colors shadow-md"
                >
                  Support Our Mission <ArrowRightIcon />
                </Link>
              </div>

              {/* Navigate */}
              <div className="flex flex-col gap-4">
                <h4 className="text-white/40 font-black text-[10px] tracking-[2.5px] uppercase">Navigate</h4>
                <ul className="flex flex-col gap-2.5">
                  {navLinks.map(label => (
                    <li key={label}>
                      <Link href={navPaths[label]} className="text-white/70 text-[13.5px] hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="flex flex-col gap-4">
                <h4 className="text-white/40 font-black text-[10px] tracking-[2.5px] uppercase">Services</h4>
                <ul className="flex flex-col gap-2.5">
                  {serviceLinks.map(label => (
                    <li key={label}>
                      <Link href={servicePaths[label]} className="text-white/70 text-[13.5px] hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-4">
                <h4 className="text-white/40 font-black text-[10px] tracking-[2.5px] uppercase">Contact</h4>
                <div className="flex flex-col gap-4">
                  {contactItems.map(({ icon, text, href }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 shrink-0">
                        {icon}
                      </div>
                      {href ? (
                        <a href={href} className="text-white/80 text-[13.5px] hover:text-white transition-colors">{text}</a>
                      ) : (
                        <span className="text-white/80 text-[13.5px]">{text}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="flex flex-col gap-4">
                <h4 className="text-white/40 font-black text-[10px] tracking-[2.5px] uppercase">Follow Us</h4>
                <div className="flex flex-wrap gap-2">
                  {SOCIALS.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-9 h-9 rounded-full bg-white/08 flex items-center justify-center text-white/70 hover:bg-accent/25 hover:text-white transition-all duration-200"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══ Bottom bar (shared) ══ */}
          <div className="border-t border-white/10 px-6 lg:px-10 xl:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/45 text-[12px] text-center sm:text-left">© 2026 BelaRisu Medical Centre. All rights reserved.</p>
            <p className="text-white/45 text-[12px] text-center sm:text-right">
              A{' '}
              <a href="https://www.belarisufoundation.org" target="_blank" rel="noopener noreferrer" className="text-accent font-bold hover:text-accent-dark transition-colors">
                Bela Risu Foundation
              </a>{' '}
              Initiative
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
