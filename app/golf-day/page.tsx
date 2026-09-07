import GolfDay from '@/views/GolfDay'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Swing For Smiles — Charity Golf Tournament',
  description:
    'Join BelaRisu Medical Centre for the Swing For Smiles charity golf tournament at Karen Country Club on World Smile Day, 02 Oct 2026. Every entry funds free cleft care.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/golf-day' },
  openGraph: {
    title: 'Swing For Smiles — Charity Golf Tournament | BelaRisu Medical Centre',
    description:
      'Play the course. Lead the change. Register for the Swing For Smiles charity golf tournament at Karen Country Club, 02 Oct 2026.',
    url: 'https://www.belarisumedicalcentre.org/golf-day',
  },
}

const page = () => {
  return <GolfDay />
}

export default page
