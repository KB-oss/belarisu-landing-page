import ClientShell from '@/components/ClientShell'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Belarisu Medical Centre',
  description: 'Free, multidisciplinary cleft lip and cleft palate care for children and adults.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
