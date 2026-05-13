import Home from '@/views/Home'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Cleft Lip & Palate Surgery in Kenya',
  description:
    'Bela Risu Medical Centre offers free cleft lip and cleft palate surgery, nutrition support, speech therapy, dental care, and psychosocial counseling for children and families across Africa.',
  alternates: { canonical: 'https://belarisumedical.org' },
  openGraph: {
    title: 'Free Cleft Lip & Palate Surgery in Kenya | Bela Risu Medical Centre',
    description:
      'Free, comprehensive cleft care — surgery, nutrition, speech therapy, dental & psychosocial support — for children and families across Africa.',
    url: 'https://belarisumedical.org',
  },
}

const page = () => {
  return (
    <div><Home /></div>
  )
}

export default page
