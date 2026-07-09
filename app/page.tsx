import Home from '@/views/Home'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Cleft Lip & Palate Surgery in Nairobi, Kenya',
  description:
    'BelaRisu Medical Centre is a comprehensive cleft care centre in Nairobi, Kenya, offering free cleft lip and palate surgery, nutrition support, speech therapy, dental care, and psychosocial counseling for children and families across Africa.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org' },
  openGraph: {
    title: 'Free Cleft Lip & Palate Surgery in Nairobi, Kenya | BelaRisu Medical Centre',
    description:
      'Free, comprehensive cleft care in Nairobi — surgery, nutrition, speech therapy, dental & psychosocial support — for children and families across Africa.',
    url: 'https://www.belarisumedicalcentre.org',
  },
}
const page = () => {
  return (
    <div><Home/></div>
  )
}

export default page
