import About from '@/views/About'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — Our Mission & Team',
  description:
    'Learn about Bela Risu Medical Centre — our mission to eliminate preventable suffering from cleft conditions, our founding story, and the multidisciplinary team delivering free care across Africa.',
  alternates: { canonical: 'https://belarisumedical.org/about' },
  openGraph: {
    title: 'About Bela Risu Medical Centre — Mission & Team',
    description:
      'Our mission is to ensure no child suffers in silence from a cleft condition. Meet the team behind free, comprehensive cleft care across Africa.',
    url: 'https://belarisumedical.org/about',
  },
}

export default About
