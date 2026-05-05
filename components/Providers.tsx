'use client'

import { AnimatePresence } from 'framer-motion'
import { DonationProvider, useDonation } from '../context/DonationContext'
import SmoothScroll from './SmoothScroll'
import Nav from './Nav'
import PageLoader from './PageLoader'
import DonationModal from './DonationModal'
import React from 'react'
import Footer from './footer'

interface ShellProps {
  children: React.ReactNode
}

function Shell({ children }: ShellProps) {
  const { open, openModal, closeModal } = useDonation()

  return (
    <>
      <PageLoader />
      <SmoothScroll>
        <Nav />
        <main>{children}</main>
        <Footer />
      </SmoothScroll>

      {/* Support Our Mission — floating FAB */}
      <div className="fixed bottom-7 right-7 z-40">
        <button
          onClick={openModal}
          className="group flex items-center gap-2.5 bg-accent text-white font-bold text-[13px] tracking-[0.2px] pl-4 pr-5 py-3.5 rounded-full transition-all duration-200 hover:bg-accent-dark hover:-translate-y-0.5"
          style={{ boxShadow: '0 8px 28px rgba(255,117,24,0.40)' }}
        >
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
          Support Our Mission
        </button>
      </div>

      <AnimatePresence>
        {open && <DonationModal onClose={closeModal} />}
      </AnimatePresence>
    </>
  )
}

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <DonationProvider>
      <Shell>{children}</Shell>
    </DonationProvider>
  )
}
