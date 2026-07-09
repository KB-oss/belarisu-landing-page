import ClientShell from '@/components/ClientShell'
import './globals.css'
import type { Metadata } from 'next'

const BASE_URL = 'https://www.belarisumedicalcentre.org'
const OG_IMAGE = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778246041/0B2A0278_1_sy7sb7.webp'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bela Risu Medical Centre — Free Cleft Care in Africa',
    template: '%s | Bela Risu Medical Centre',
  },
  description:
    'Bela Risu Medical Centre provides free, comprehensive cleft lip and cleft palate care — surgery, nutrition, speech therapy, dental & psychosocial support — for children and families across Africa.',
  keywords: [
    'belarisu medical centre',
    'belarisu medical',
    'belarisu',
    'BMC medical centre',
    'Bela Risu Medical Centre',
    'Bela Risu',    
    'belarisumedicalcentre.org',
    'Bela Risu Medical Centre Nairobi',
    'BMC Nairobi',
    'Bela Risu cleft care',
    'cleft lip surgery Kenya',
    'cleft palate treatment Africa',
    'free cleft surgery Nairobi',
    'Bela Risu Medical Centre',
    'BMC cleft care',
    'cleft lip repair Kenya',
    'free medical care children Kenya',
    'cleft palate rehabilitation',
  ],
  authors: [{ name: 'Bela Risu Medical Centre', url: BASE_URL }],
  creator: 'Bela Risu Medical Centre',
  publisher: 'Bela Risu Medical Centre',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: BASE_URL,
    siteName: 'Bela Risu Medical Centre',
    title: 'Bela Risu Medical Centre — Free Cleft Care in Africa',
    description:
      'Free, multidisciplinary cleft lip and cleft palate care for children and families across Africa.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Bela Risu Medical Centre — transforming lives through free cleft care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bela Risu Medical Centre — Free Cleft Care in Africa',
    description:
      'Free, multidisciplinary cleft lip and cleft palate care for children and families across Africa.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/Asset 4.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/Asset 4.png',
  },
  alternates: {
    canonical: BASE_URL,
  },
}
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'Bela Risu Medical Centre',
  alternateName: 'BMC',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  image: OG_IMAGE,
  description:
    'Bela Risu Medical Centre provides free, comprehensive cleft lip and cleft palate care — surgery, nutrition, speech therapy, dental & psychosocial support — for children and families across Africa.',
  email: 'info@belarisumedicalcentre.org',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KE',
    addressRegion: 'Nairobi',
  },
  medicalSpecialty: 'Plastic surgery, cleft lip and palate rehabilitation',
  availableService: [
    { '@type': 'MedicalProcedure', name: 'Cleft Lip Repair' },
    { '@type': 'MedicalProcedure', name: 'Cleft Palate Repair' },
    { '@type': 'MedicalTherapy', name: 'Speech and Language Therapy' },
    { '@type': 'MedicalTherapy', name: 'Nutrition Rehabilitation' },
    { '@type': 'MedicalTherapy', name: 'Orthodontics and Dental Care' },
    { '@type': 'MedicalTherapy', name: 'ENT Care' },
    { '@type': 'MedicalTherapy', name: 'Psychosocial Counseling' },
  ],
  sameAs: [
    'https://www.facebook.com/belarisumedical',
    'https://www.instagram.com/belarisumedical',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
