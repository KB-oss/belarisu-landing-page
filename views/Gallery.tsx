'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/Reveal'
import { useDonation } from '../context/DonationContext'

/* ─── Design tokens ─── */
const PLAYFAIR = "'Playfair Display', Georgia, 'Times New Roman', serif"
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* ─── Assets ─── */
const IMG_DONATE_BG = 'https://www.figma.com/api/mcp/asset/cb1c0fde-e50f-4de1-bf06-f15f545310bb'

interface GalleryImage {
  src: string
  tag: string
}

const ALL_IMGS: GalleryImage[] = [
  { src: 'https://www.figma.com/api/mcp/asset/fe4616c9-b7c1-4c89-923f-ff9ff6553a62', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/67319a10-2792-4b77-b3f0-3ee2b7009e59', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/ecfed35b-d125-43b9-afbb-1bfd4efedaf9', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/99fa4cd2-a58a-4e1c-b727-0e5627ecc415', tag: 'Nutrition' },
  { src: 'https://www.figma.com/api/mcp/asset/64260d8a-03f7-4a9e-b545-4647556fe538', tag: 'Nutrition' },
  { src: 'https://www.figma.com/api/mcp/asset/f001bda8-c97f-4c17-9f0a-5fe9c7a167d5', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/4f22803b-bccc-41ce-a0b7-f22934465126', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/42e0f05d-6463-46d5-a2cd-9ae3ee5f3ecc', tag: 'Nutrition' },
  { src: 'https://www.figma.com/api/mcp/asset/c029f2e2-63dc-4dc7-a562-fd7e57d473b4', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/83ca3b6c-dbda-4577-a838-35e56ef67f0d', tag: 'Nutrition' },
  { src: 'https://www.figma.com/api/mcp/asset/19b1221b-c97d-4284-834a-94720bd5d901', tag: 'Surgery' },
  { src: 'https://www.figma.com/api/mcp/asset/4f3f045f-4c51-4c7a-8de1-4506e7794f09', tag: 'Surgery' },
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
  const { openModal } = useDonation()

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
            {displayed.map(({ src, tag }, i) => (
              <motion.div
                key={src + i}
                className="break-inside-avoid mb-3 rounded-[16px] overflow-hidden bg-[#f1f5f9] cursor-pointer group shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => setLightbox(src)}
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
          <div className="relative rounded-[16px] overflow-hidden" style={{ minHeight: '480px' }}>
            <img
              src={IMG_DONATE_BG}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Failed to load donate background image')
                e.currentTarget.style.display = 'none'
              }}
            />
            {/* Right-side text overlay */}
            <div className="absolute inset-0 flex items-center justify-end">
              <div
                className="flex flex-col gap-4 pr-[6%] pl-4 py-12"
                style={{ width: '52%' }}
              >
                <h2
                  className="font-black leading-[1.1] tracking-[-0.025em] text-[#171717]"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 3.5rem)' }}
                >
                  Give a Child Their{' '}
                  <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                    First Smile
                  </em>
                </h2>
                <p className="text-[18px] leading-[1.7]" style={{ color: '#071e36', maxWidth: '540px' }}>
                  Your generosity brings life-changing care to provide life-changing cleft care to those who need it most. Join us in making a profound difference.
                </p>
                <div>
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 bg-white font-black text-[16px] px-8 py-4 rounded-full hover:-translate-y-px transition-all duration-200"
                    style={{ color: '#ff7518' }}
                  >
                    Donate Now
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            <motion.img
              src={getImageSrc(lightbox)} 
              alt="Enlarged photo"
              className="max-h-[88vh] max-w-[88vw] rounded-[16px] object-contain cursor-default"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => handleImageError(lightbox)}
            />
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