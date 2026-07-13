import Home from '@/views/Home'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Cleft Lip & Palate Surgery in Kenya',
  description:
    'Bela Risu Medical Centre offers free cleft lip and cleft palate surgery, nutrition support, speech therapy, dental care, and psychosocial counseling for children and families across Africa.',
  alternates: { canonical: 'https://www.belarisumedicalcentre.org' },
  openGraph: {
    title: 'Free Cleft Lip & Palate Surgery in Kenya | Bela Risu Medical Centre',
    description:
      'Free, comprehensive cleft care — surgery, nutrition, speech therapy, dental & psychosocial support — for children and families across Africa.',
    url: 'https://www.belarisumedicalcentre.org',
  },
}
const page = () => {
  return (
    <div><Home/></div>
  )
}

export default page
