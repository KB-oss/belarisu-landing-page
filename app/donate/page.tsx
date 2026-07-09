import DonatePage from '@/features/donate/donate'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate — Give a Child Their First Smile',
  description:
    'Your donation funds free cleft surgeries and comprehensive care for children across Africa. Every gift gives a child their first smile, their first word, their first chance to belong.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/donate' },
  openGraph: {
    title: 'Donate | Give a Child Their First Smile — Bela Risu Medical Centre',
    description:
      'Fund free cleft lip and palate surgery for a child in need. Every donation makes life-changing care possible for families across Africa.',
    url: 'https://www.belarisumedicalcentre.org/donate',
  },
}

const page = () => {
  return (
    <div><DonatePage /></div>
  )
}

export default page
