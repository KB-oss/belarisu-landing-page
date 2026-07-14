import Gallery from '@/views/Gallery'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patient Stories & Transformations',
  description:
    'Witness the life-changing transformations at BelaRisu Medical Centre. Real stories and before-and-after journeys of children who received free cleft care.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/gallery' },
  openGraph: {
    title: 'Patient Stories & Transformations | BelaRisu Medical Centre',
    description:
      'Real stories of children whose lives were changed by free cleft surgery and care at BelaRisu Medical Centre across Africa.',
    url: 'https://www.belarisumedicalcentre.org/gallery',
  },
}

export default Gallery
