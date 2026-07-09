import Gallery from '@/views/Gallery'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patient Stories & Transformations',
  description:
    'Witness the life-changing transformations at Bela Risu Medical Centre. Real stories and before-and-after journeys of children who received free cleft care.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/gallery' },
  openGraph: {
    title: 'Patient Stories & Transformations | Bela Risu Medical Centre',
    description:
      'Real stories of children whose lives were changed by free cleft surgery and care at Bela Risu Medical Centre across Africa.',
    url: 'https://www.belarisumedicalcentre.org/gallery',
  },
}

export default Gallery
