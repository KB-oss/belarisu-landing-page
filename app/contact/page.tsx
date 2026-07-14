import Contact from '@/views/Contact'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the BelaRisu Medical Centre team. We\'re here to answer your questions, connect you with free cleft care, and support families across Africa.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/contact' },
  openGraph: {
    title: 'Contact BelaRisu Medical Centre',
    description:
      'Reach our team for questions about free cleft care services, appointments, partnerships, or donations. We\'re here to help.',
    url: 'https://www.belarisumedicalcentre.org/contact',
  },
}

export default Contact
