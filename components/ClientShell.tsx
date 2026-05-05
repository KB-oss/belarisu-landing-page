'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Providers = dynamic(() => import('./Providers'), { ssr: false })

interface ClientShellProps {
  children: React.ReactNode
}

export default function ClientShell({ children }: ClientShellProps) {
  return <Providers>{children}</Providers>
}
