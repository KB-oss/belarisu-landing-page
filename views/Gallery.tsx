'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/Reveal'
import { useDonation } from '../context/DonationContext'
import { Heart } from 'lucide-react'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Assets ─── */
const IMG_DONATE_BG = 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997447/Amelia_Chreseria_Njeri_-_Cleft_Lip_and_Cleft_Palate_-_4_years_-_Ruiru_t1zysd.webp'

interface GalleryImage {
  src: string
  tag: string
  desc?: string
  name?: string
}

const ALL_IMGS: GalleryImage[] = [
  {
    src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002949/IMG_0336_mh0hqn.jpg', tag: 'Surgery', name: 'Ayman Abdinassir',
    desc: `When Fatuma welcomed her son into the world, she was met with both joy and uncertainty.
Born in Mandera, baby Ayman arrived with a bilateral cleft lip, something no one in the family had ever encountered before. The news was unexpected, and for a moment, it felt overwhelming. 
But that moment didn't last long, because love stepped in quickly. "It's Allah who blesses us with children," Fatuma says. "So I embraced my son with all my heart, despite his condition."
At just 22 years old, Fatuma found herself navigating something new. Her mother and her husband became her anchors, creating a circle of unwavering support around Ayman. While stigma often surrounds cleft conditions, this family chose a different path. They focused on care, on possibility, and on hope.
That hope became real when Fatuma's mother, searching for answers, spotted a billboard in Eastleigh about free cleft surgery at BelaRisu Medical Centre. It was the turning point they had been waiting for. 
Before the surgery, even the simplest moments were difficult. "Feeding used to be a big struggle, he could barely finish half a bottle," Fatuma recalls. "Now, watching him feed with his lips closed is such an overwhelming experience."
As the family prepares to return home to Mandera, they carry with them relief, joy, and a renewed sense of possibility. Fatuma looks ahead with quiet confidence, and Ayman's smile now holds the promise of a bright and beautiful future.`

  },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778180681/david_after_dgjqtz.jpg', tag: 'Surgery' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997446/Amelia_Chreseria_Njeri_-_Cleft_Lip_and_Cleft_Palate_-_4_years_-_Ruiru_1_caajti.webp', tag: 'Surgery' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778183880/nutrition-gallery_wxzsnf.jpg', tag: 'Nutrition' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778183880/gallery_image_kf4g65.jpg', tag: 'Nutrition' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002940/1H4A1037_wldags.jpg', tag: 'Surgery' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778184193/gallery_surgery_1_uw57yb.jpg', tag: 'Surgery' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003058/1H4A2800_kzsqy6.jpg', tag: 'Nutrition' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778184193/gallery_surgery_qc6kk8.jpg', tag: 'Surgery' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777995798/YY4_2_of9xhh.webp', tag: 'Nutrition' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002968/1H4A2346_kosbyt.jpg', tag: 'Surgery' },
  { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777995839/MM9_ar0km0.webp', tag: 'Surgery' },
]

const FILTERS = ['All Stories', 'Surgery', 'Nutrition'] as const
type FilterType = typeof FILTERS[number]

function CloseIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  )
}

/* ═══════════════════════════════════════ */
export default function Gallery() {
  const [filter, setFilter] = useState<FilterType>('All Stories')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [description, setDesc] = useState<{ title: string, desc: string } | null>(null)
  const { openModal } = useDonation()
  const [isHovered, setIsHovered] = useState(false);


  // Image loading error handling
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const displayed = filter === 'All Stories'
    ? ALL_IMGS
    : ALL_IMGS.filter((img) => img.tag === filter)

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src))
  }

  // Helper to get working image URL with fallback
  const getImageSrc = (src: string) => {
    if (failedImages.has(src)) {
      // Fallback to a placeholder with the same aspect ratio
      return `https://placehold.co/600x400/e8e3db/071e36?text=Image+Not+Available`
    }
    return src
  }

  return (
    <div className="pt-[88px]" style={{ background: '#fdfcfb', overflowX: 'clip' }}>

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <div className={`${WRAP} pt-16 pb-8 flex flex-col items-center justify-center text-center`}>
        <Reveal direction="up" className='flex flex-col items-center justify-center'>
          <h1
            className="font-black leading-[1.05] tracking-[-0.025em] text-[#071e36] mb-4"
            style={{ fontSize: 'clamp(2.4rem, 6.6vw, 6rem)' }}
          >
            Witness the{' '}
            <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
              Transformations
            </em>
          </h1>
          <p className="text-[18px] leading-[1.6]" style={{ color: '#45556c', maxWidth: '600px' }}>
            Witness the joy and the transformations that happen every day at BMC.
          </p>
        </Reveal>

        {/* Filter pills */}
        <Reveal direction="up" delay={0.08}>
          <div className="flex items-center gap-3 flex-wrap justify-center mt-7">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="text-[13px] font-bold px-6 py-2.5 rounded-full transition-all duration-200"
                style={{
                  background: filter === f ? '#071e36' : '#fff',
                  color: filter === f ? '#fff' : '#62748e',
                  border: filter === f ? 'none' : '1px solid #e2e8f0',
                  boxShadow: filter === f ? '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          MASONRY GRID
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-20`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-gap:12px]"
          >
            {displayed.map(({ src, tag, desc, name }, i) => (
              <motion.div
                key={src + i}
                className="break-inside-avoid mb-3 rounded-[16px] overflow-hidden bg-[#f1f5f9] cursor-pointer group shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => {
                  setLightbox(src)
                  setDesc({ title: name || "", desc: desc || "" })
                }}
              >
                <img
                  src={getImageSrc(src)}
                  alt={`${tag} patient story ${i + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  loading="lazy"
                  onError={() => handleImageError(src)}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════
          DONATE CTA — image card
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-20`}>
        <Reveal direction="up">
          <section className="py-8 sm:py-10 lg:py-14">
            <div className={WRAP}>
              <div
                className="relative overflow-hidden rounded-[24px] sm:rounded-[28px]"
                style={{ minHeight: '440px' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Both images rendered simultaneously for smoother crossfade */}
                <motion.img
                  src={IMG_DONATE_BG}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                />

                <motion.img
                  src="https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777997446/Amelia_Chreseria_Njeri_-_Cleft_Lip_and_Cleft_Palate_-_4_years_-_Ruiru_1_caajti.webp"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 1.02
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1],
                    opacity: { duration: 0.7 },
                    scale: { duration: 0.9, ease: [0.32, 0, 0.67, 0] }
                  }}
                />

                {/* Gradient Overlay with subtle hover enhancement */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to right, rgba(7,30,54,0.05) 0%, rgba(7,30,54,0.65) 45%, rgba(7,30,54,0.93) 100%)',
                  }}
                  animate={{
                    background: isHovered
                      ? 'linear-gradient(to right, rgba(7,30,54,0.15) 0%, rgba(7,30,54,0.75) 45%, rgba(7,30,54,0.95) 100%)'
                      : 'linear-gradient(to right, rgba(7,30,54,0.05) 0%, rgba(7,30,54,0.65) 45%, rgba(7,30,54,0.93) 100%)'
                  }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                />

                <div className="relative z-10 flex items-center justify-end min-h-[440px]">
                  <div className="max-w-[460px] p-10 sm:p-12 lg:p-16">
                    <motion.p
                      className="font-black uppercase tracking-[3px] mb-5"
                      style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.32)' }}
                      animate={{ opacity: isHovered ? 0.7 : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Make a Difference
                    </motion.p>
                    <h2
                      className="font-black text-white leading-[1.06] tracking-[-1.5px] mb-5"
                      style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)' }}
                    >
                      Give a Child Their{' '}
                      <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                        First Smile
                      </em>
                    </h2>
                    <motion.p
                      className="text-[14px] leading-[1.9] mb-9 font-light"
                      style={{ color: 'rgba(255,255,255,0.50)' }}
                      animate={{ opacity: isHovered ? 0.85 : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Your generosity brings life-changing cleft care to those who need it most.
                    </motion.p>
                    <motion.button
                      onClick={openModal}
                      className="inline-flex items-center gap-2 bg-white text-accent font-black text-[13px] px-7 py-3.5 rounded-full hover:bg-accent hover:text-white transition-all duration-200 shadow-xl hover:-translate-y-px"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Donate Now <Heart />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      {/* ══════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.88)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightbox(null)}
          >
            {/* Side by side container - or full width if no description */}
            <div
              className={`flex flex-col md:flex-row gap-6 bg-white rounded-2xl overflow-hidden max-h-[90vh] cursor-default ${description?.desc ? 'max-w-6xl w-full' : 'max-w-[90vw] w-auto'
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image side - adjusts based on description */}
              <div
                className={`flex items-center justify-center ${description?.desc ? 'md:w-1/2 w-full' : 'w-full'
                  }`}
              >
                <motion.img
                  src={getImageSrc(lightbox)}
                  alt="Enlarged photo"
                  className={`${description?.desc
                      ? 'w-full h-full object-cover'
                      : 'max-h-[85vh] w-auto object-contain'
                    }`}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => handleImageError(lightbox)}
                />
              </div>

              {/* Text side - only show if description exists */}
              {description?.desc && (
                <div className="md:w-1/2 w-full bg-white overflow-y-auto p-6 md:p-8">
                  <div className="prose prose-lg max-w-none">
                    {description?.title && (
                      <h1 className='text-gray-800 text-2xl font-bold leading-relaxed mb-2'>
                        {description.title}
                      </h1>
                    )}
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {description.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Close button outside the modal content */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}