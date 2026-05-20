'use client'

import { createContext, useContext, useState } from 'react'
export interface DonationContextValue {
  open: boolean
  openModal: () => void
  closeModal: () => void
}
const DonationContext = createContext<DonationContextValue | null>(null)

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <DonationContext.Provider value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}>
      {children}
    </DonationContext.Provider>
  )
}

export function useDonation(): DonationContextValue {
  const ctx = useContext(DonationContext)
  if (!ctx) throw new Error('useDonation must be used within a DonationProvider')
  return ctx
}
