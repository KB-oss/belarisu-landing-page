import BookingPage from "@/features/booking/booking"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book an Appointment — Free Cleft Care Consultation',
  description:
    'Schedule your free cleft care consultation at Bela Risu Medical Centre. Our multidisciplinary team is ready to help children and families access life-changing surgery and support.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org/booking' },
  openGraph: {
    title: 'Book a Free Consultation | Bela Risu Medical Centre',
    description:
      'Book a free cleft care appointment at Bela Risu Medical Centre. Surgery, nutrition, speech therapy, dental, and more — all at no cost.',
    url: 'https://www.belarisumedicalcentre.org/booking',
  },
  robots: { index: true, follow: true },
}

const page = () => {
  return (
    <div><BookingPage /></div>
  )
}

export default page
