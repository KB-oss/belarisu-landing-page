import ClientShell from '@/components/ClientShell'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Belarisu Medical Centre',
  description: 'Free, multidisciplinary cleft lip and cleft palate care for children and adults.',
  icons: {
    icon: [
      { url: "./Asset 4.png", sizes: "16x16", type: "image/png" },
      // { url: "./LIGHT.ico", sizes: "32x32", type: "image/x-icon" },
      // { url: "./icon-64.png", sizes: "64x64", type: "image/png" },
      // { url: "./icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "./apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
