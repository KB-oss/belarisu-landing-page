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
  src: string | string[]
  tag: string
  desc?: string
  name?: string
}

const ALL_IMGS: GalleryImage[] = [
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002949/IMG_0336_mh0hqn.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002940/1H4A1037_wldags.jpg'], tag: 'Surgery', name: 'Ayman Abdinassir',
    desc: `When Fatuma welcomed her son into the world, she was met with both joy and uncertainty.
Born in Mandera, baby Ayman arrived with a bilateral cleft lip, something no one in the family had ever encountered before. The news was unexpected, and for a moment, it felt overwhelming. 
But that moment didn't last long, because love stepped in quickly. "It's Allah who blesses us with children," Fatuma says. "So I embraced my son with all my heart, despite his condition."
At just 22 years old, Fatuma found herself navigating something new. Her mother and her husband became her anchors, creating a circle of unwavering support around Ayman. While stigma often surrounds cleft conditions, this family chose a different path. They focused on care, on possibility, and on hope.
That hope became real when Fatuma's mother, searching for answers, spotted a billboard in Eastleigh about free cleft surgery at BelaRisu Medical Centre. It was the turning point they had been waiting for. 
Before the surgery, even the simplest moments were difficult. "Feeding used to be a big struggle, he could barely finish half a bottle," Fatuma recalls. "Now, watching him feed with his lips closed is such an overwhelming experience."
As the family prepares to return home to Mandera, they carry with them relief, joy, and a renewed sense of possibility. Fatuma looks ahead with quiet confidence, and Ayman's smile now holds the promise of a bright and beautiful future.`

  },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002965/1H4A1675_rngiou.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002968/1H4A2346_kosbyt.jpg'], tag: 'Surgery', name: 'Blessing Wangui',
    desc: `For Carolyne, every photograph of her daughter tells a story of grace, courage, and transformation. From the moment Blessing was born to the day her cleft lip was repaired, each image has been carefully kept as a visual reminder of a journey that once felt uncertain, but is now filled with gratitude.

"I've kept many photos of Blessing before and after her surgery," Carolyne shares. "One day, I want her to see the incredible journey she's been through. And maybe, if she ever faces something similar in the future, she'll remember where her strength comes from."

But the beginning was not easy. Shortly after delivering Blessing via C-section, Carolyne was told that her baby had been born with a cleft lip. The news came suddenly, and with it, fear. "My blood pressure spiked when I heard," she recalls. "It was my first time encountering something like this, and I was completely frightened."

In those early moments, it was the support around her that made all the difference. Through counseling from doctors and the steady presence of her husband, Carolyne found the strength to move from fear to acceptance. "Her father was deeply affected too, but he stood by us. That gave me strength," she says. "I never hid my daughter. I wanted people to see her and love her just as we do."

Hope came into clearer focus during a visit to Eastleigh, where Carolyne came across the hospital that would refer her to BelaRisu Medical Centre. Without hesitation, she inquired, registered, and prepared Blessing for surgery. At just two months old, Blessing underwent a successful cleft lip repair.

Today, the photos she keeps are no longer just reminders of uncertainty, but markers of resilience, of love, and of a future restored. Carolyne now carries her story forward with purpose, committed to sharing her daughter's journey so that other families can find the same hope she once needed.

Because some journeys are not just meant to be remembered. They are meant to light the way for others.`
  },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002977/1H4A6904_fdb1tk.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002975/1H4A2998_g5jyhe.jpg'], tag: 'Surgery', name: 'Daniel Musyoki',
    desc: `For Caro, the birth of her son Daniel marked the beginning of a difficult and deeply isolating journey.
Born with a cleft lip in Mwea, Daniel's arrival was not met with celebration by everyone. Instead, Caro faced immediate rejection from her husband and in-laws, who urged her to abandon her child. "When Daniel was born, they said he was a bad omen," Caro recalls. "When I refused to leave him, they left me."

Suddenly, she was alone, caring for four children, including a newborn with urgent feeding needs. In a place where electricity is unreliable, even the simplest tasks became overwhelming. When Daniel stopped breastfeeding at just three weeks old, Caro had to express and store milk without consistent power, often warming it over firewood.

Formula milk offered a temporary solution, but it came at a cost she could not sustain. To keep Daniel alive, Caro took out loans until debt became a constant shadow over her life. Beyond the financial strain, the emotional toll was just as heavy. Stigma surrounding Daniel's condition began to shape how others saw him, even within his own home. "At one point, even my other children started avoiding him. It broke my heart. I felt completely alone."

But in the midst of that isolation, hope found her. Through her church, Caro was connected to another mother whose child had received cleft surgery at BelaRisu Medical Centre. For the first time, she saw what was possible. "I never imagined his condition could be fixed. That was the first time I had seen such a transformation."

Daniel was able to access surgery at eight months old, a turning point that changed everything. The transformation went beyond Daniel's smile. Her husband returned. Her in-laws, once distant, began showing up again, bringing food, and offering support. Slowly, the pieces of her life began to come back together.

Today, Caro is focused on rebuilding, repaying her loans, returning to her farm, and creating a more stable future for her children. Because for her, this journey was never just about surgery. It was about survival, resilience, and the restoration of a family.`
  },
  // { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778183880/nutrition-gallery_wxzsnf.jpg', tag: 'Nutrition' },
  // { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778183880/gallery_image_kf4g65.jpg', tag: 'Nutrition' },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002985/0B2A4613_tfmie4.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778002988/1H4A8489_paadv4.jpg'], tag: 'Surgery', name: 'Jayden Baraka',
    desc: `When Jayden was born, his mother was overwhelmed by fear. She had never seen a child born with a cleft lip before. The shock was immediate and consuming: so much so that, in a moment of panic, she tried to leave the hospital without him. "I wasn't thinking clearly," she recalls. "I was so scared. I just wanted to run away."

Raised in a community where stigma and harmful beliefs surround conditions like Jayden's, she knew what might lie ahead. The weight of that fear made everything feel impossible. A watchman gently stopped her, and she returned to the ward, though the emotional distance remained. For days, she struggled to face her reality. "For a week, I couldn't bring myself to look at him or even feed him," she says quietly.

It was through the persistence and compassion of the nurses and doctors in Embu that something began to shift. Through counseling, patience, and care, they helped her begin to see her child differently. "During that time, I saw other children with serious chronic conditions. It made me rethink everything. My baby wasn't the worst off. I decided to accept him."

Taking Jayden home brought new challenges. While her husband stood by her, her in-laws responded with rejection, calling her names, blaming her, and deepening her isolation. Eventually, the pressure became too much, and she made the difficult decision to leave her matrimonial home.

Even the basics of care were hard. Feeding Jayden was a daily struggle, and the cost of alternatives to breastfeeding added financial strain. Fear of judgment followed her everywhere. For a time, it felt like this would be Jayden's reality.

Until hope found its way in. Through a friend, she learned about BelaRisu Medical Center and the possibility of surgery. It was the turning point she had not dared to imagine. At one year old, Jayden underwent cleft lip repair.

Today, Jayden is full of life walking, running, and playing like any other child his age. And his mother, once overwhelmed by fear, now carries a different truth: that love can grow, even in the hardest moments, that acceptance can be learned, that sometimes, the most powerful journeys begin with simply choosing to stay.`


  },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003005/1H4A8469_gedjbq.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003003/1H4A0619_gopvsf.jpg'], tag: 'Surgery', name: "Jayson Takim",
    desc: `For Veronika, life came in waves.

The first was devastating. A diagnosis of stage three cervical cancer that shattered her world and pulled her into the grueling reality of chemotherapy. The treatment was relentless, taking a physical and emotional toll, yet she endured it with quiet strength.

And then, in the midst of it all, something unexpected happened. After 13 years of waiting, hoping, and heartbreak, Veronika discovered she was pregnant. "I felt immense joy," she says. "But it came with tough decisions." Against medical advice, she made a choice that would define her journey, she chose to carry her baby and pause her chemotherapy. For her, this child was more than a pregnancy. It was hope, renewal, and a second chance at something she had long believed might never come.

But the journey was not over. After everything she had endured, another challenge emerged. Her baby, Jason, was born with a cleft lip, a condition she had never encountered before.

"When the doctors told me, my heart sank," Veronika recalls. "After all the sacrifices I had made, it felt like another blow." Questions filled her mind, doubts crept in, but slowly, reassurance followed. "The doctors told me it was not permanent, that it could be fixed. That gave me some comfort."

Returning home, Veronika faced not only the demands of caring for a newborn, but also the weight of public judgment. Whispers from neighbors, questions about her illness, even accusations that she had fabricated her struggles, was a heavy burden to carry alongside everything else. But she did not let it define her. Through the support of friends and her church, and a referral that came at just the right time, Veronika found her way to BelaRisu Medical Center.

What she found there was more than care. It was reassurance, community, and possibility.

"Reaching out felt like finding a beacon of hope," she says. "They welcomed me warmly."

Jason underwent cleft lip surgery, marking yet another turning point in a journey that had already asked so much of her.

Today, as Veronika prepares to resume her chemotherapy, she does so with a different kind of strength shaped by everything she has chosen, endured, and overcome, and believing that even in the most difficult seasons, hope has a way of finding you.`

  },
  // { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777995833/0B2A0490_vvf8yg.webp', tag: 'Nutrition' },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003025/0B2A3578-2_a85ify.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003027/0B2A9883_sgeche.jpg'], tag: 'Surgery', name: "Judy Keisha Wambui",
    desc: `For years, James had noticed the small scar on his mother's lip. He never asked about it out of care, as he didn't want to risk reopening something painful.

It wasn't until the birth of his daughter that the meaning of that scar came into focus.

When Wambui was born with a cleft lip and palate, James was overwhelmed. "I was shocked," he recalls. "Paralyzed with fear." In that moment, everything felt uncertain, her future, her wellbeing, the life she would grow into. But when he called his mother to share the news, something unexpected happened.

For the first time, she told him her story. She, too, had been born with a cleft lip. The scar he had quietly noticed all his life became a source of comfort, a reminder that healing was possible, that this journey had been walked before. Still, the early days were not easy. At first, James struggled to even hold his daughter, weighed down by fear of what lay ahead. Determined to find a solution, he began setting aside money for her surgery. "The thought of her facing ridicule was overwhelming," he says.

For Esther, Wambui's mother, the challenges were immediate and constant. Feeding was a daily struggle. Milk would come through Wambui's nose, making each attempt stressful and uncertain. Misinformation at the delivery facility meant Esther never had the chance to breastfeed, leaving her to rely on formula. "Waking up in the middle of the night to express and warm milk felt like constant torture," she shares. "The formula was expensive, and I was always worried she wasn't getting enough."

But even in the exhaustion and fear, they held on to each other, and to the belief that things could change. When Wambui was three months old, a referral led them to BelaRisu Medical Center. It was a turning point. "On the day of the surgery, I was terrified," Esther recalls. "But seeing other children who had gone through the same thing gave me strength." The surgery marked the beginning of a new chapter.

Today, Wambui is full of life. At seven months old, she is playful, joyful, and thriving, bringing light into the very space that once held so much fear. "It's such a relief to see our daughter happy," James says. "Knowing she will grow up without being judged makes everything we went through worth it."

And somewhere in that journey, a scar that was once unspoken became a quiet legacy of resilience - a reminder that healing carries forward through generations, making the path a little lighter for the next.`

  },
  // { src: 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1777995798/YY4_2_of9xhh.webp', tag: 'Nutrition' },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003058/1H4A2800_kzsqy6.jpg', 'https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003061/1H4A9419_g7dimo.jpg'], tag: 'Surgery', name: 'Marium Rana',
    desc: `When Mercy holds her daughter today, it is with a kind of joy that once felt out of reach. Tears come easily now, but they are no longer from fear. They are from relief, from gratitude, from everything they have overcome.

Her daughter, Mariam, was born with a cleft lip. From the very beginning, what should have been a moment of celebration was overshadowed by stigma and silence. "In the maternity ward, I felt the stares… the whispers," Mercy recalls. "I was ashamed. I found myself making excuses just to protect my baby."

In her community, deeply rooted beliefs and taboos made the journey even heavier. What she needed was support, but what she often received was judgment. Even within her own family, there were moments of painful rejection.

But Mercy did not face it alone. Her husband stood beside her, a steady source of strength when everything else felt uncertain. Together, they held on to hope, even when it felt distant. That hope began to take shape in an unexpected way. In a moment of vulnerability, Mercy shared her daughter's story online, asking for help. When someone responded with information about possible treatment, she hesitated. The fear of scams was real, and the risk felt high. But so was her determination. "I couldn't let fear stop me," she says. "All I could think about was getting my daughter the help she needed."

With courage, she made the journey from Bondo to Nairobi. What she found changed everything. At BelaRisu Medical Center, Mercy and her family were met with care, warmth, and reassurance. A nurse who had reached out earlier became part of that turning point, offering both information and kindness when it was needed most.

Mariam underwent a successful cleft lip surgery, and in that moment, a new chapter began. Mercy says, smiling, "My family keeps calling, asking for pictures. They can't believe the transformation." Mercy prepares to return home with pride. Pride in her daughter. Pride in the journey. Pride in the courage it took to keep going.`

  },
  {
    src: ['https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003072/1H4A2763_j9krcw.jpg', `https://res.cloudinary.com/dtqbzj2sg/image/upload/q_auto/f_auto/v1778003069/1H4A1270_xgrbxy.jpg`], tag: 'Surgery', name: 'Bianca Tyra Adisa',
    desc: `As Joyce holds her daughter close, there is a quiet moment she never takes for granted. Bianca is breastfeeding, peacefully and comfortably, with her mouth closed. It is a simple act. But for Joyce, it means everything. “I can’t stop looking at her,” she says softly. “I’m just so grateful.”

    Not long ago, this moment felt impossible. When Bianca was born, Joyce, now a mother of three, was told that her baby had a cleft lip. It was something she had never encountered before, and the news left her shaken. “I didn’t know how to handle it,” she recalls. “When I told my husband, he was just as shocked.”

    In those early days, uncertainty loomed large. But Joyce did not walk the journey alone. Surrounded by the steady support of her family and the strength of her church community, she began to find her footing. Encouraged by those around her, she searched for answers, and found hope in the possibility of surgery at BelaRisu Medical Center. That hope carried her through the waiting, the questions, and the fear. “We were supposed to dedicate Bianca at church,” Joyce shares, smiling. “But we postponed it so she could have her surgery first. Now, I can’t wait to proudly present her.”
When the day finally came, Joyce faced it with courage. And on the other side of that moment, everything changed. Today, the stress that once filled her days has been replaced with gratitude. The challenges that once felt overwhelming have given way to joy.
And soon, Joyce will stand before her church, holding her daughter as a testament to everything they have overcome. “My family and my church have been my pillars,” she says. “They carried me through.” As she prepares to return home, Joyce looks ahead with excitement, ready to share Bianca with the world. 

`
  },
]

const FILTERS = ['All Stories',
  // 'Surgery', 'Nutrition'
] as const
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
  const [lightbox, setLightbox] = useState<string | string[] | null>(null)
  const [description, setDesc] = useState<{ title: string, desc: string } | null>(null)
  const { openModal } = useDonation()
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0)


  // Image loading error handling
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (lightbox) {
      setCurrentImageIndex(0)
    }
  }, [lightbox])
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
            style={{ fontSize: 'clamp(2.8rem, 6.6vw, 6rem)' }}
          >
            Witness the{' '}
            <em className="not-italic text-accent sm:break-normal break-all" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
              Transformations
            </em>
          </h1>
          <p className="text-[18px] sm:text-[20px] font-light leading-[1.6] max-w-[720px] mx-auto" style={{ color: '#45556c' }}>
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
                key={Array.isArray(src) ? src.join(',') + i : src + i}
                className="break-inside-avoid mb-3 rounded-[16px] overflow-hidden bg-[#f1f5f9] cursor-pointer group shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => {
                  // Handle both string and array src
                  setLightbox(src)
                  setDesc({ title: name || "", desc: desc || "" })
                }}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={getImageSrc(Array.isArray(src) ? src[0] : src)}
                    alt={`${tag} patient story ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    loading="lazy"
                    onError={() => handleImageError(Array.isArray(src) ? src[0] : src)}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════
          DONATE CTA — image card
      ══════════════════════════════════ */}
      <div className={`${WRAP} pb-20 px-0!`}>
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
                      className="font-black uppercase tracking-[3px] mb-4"
                      style={{ fontSize: '8px', color: 'rgba(255,255,255,0.32)' }}
                      animate={{ opacity: isHovered ? 0.7 : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Make a Difference
                    </motion.p>
                    <h2
                      className="font-black text-white leading-[1.2] tracking-[-1px] mb-4"
                      style={{ fontSize: 'clamp(0.9rem, 3vw, 2.5rem)' }}
                    >
                      Give a Child Their{' '}
                      <em className="not-italic text-accent" style={{ fontFamily: PLAYFAIR, fontStyle: 'italic' }}>
                        First Smile
                      </em>
                    </h2>
                    <motion.p
                      className="text-[12px] leading-[1.7] mb-7 font-light"
                      style={{ color: 'rgba(255,255,255,0.50)' }}
                      animate={{ opacity: isHovered ? 0.85 : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Your generosity brings life-changing cleft care to those who need it most.
                    </motion.p>
                    <motion.button
                      onClick={openModal}
                      className="inline-flex items-center gap-2 bg-white text-accent font-black text-[11px] px-6 py-3 rounded-full hover:bg-accent hover:text-white transition-all duration-200 shadow-xl hover:-translate-y-px"
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
              {/* Image side with carousel - adjusts based on description */}
              <div
                className={`flex items-center justify-center relative ${description?.desc ? 'md:w-1/2 w-full' : 'w-full'
                  }`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.img
                    key={Array.isArray(lightbox) ? currentImageIndex : 0}
                    src={Array.isArray(lightbox) ? getImageSrc(lightbox[currentImageIndex]) : getImageSrc(lightbox)}
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
                    onError={() => handleImageError(Array.isArray(lightbox) ? lightbox[currentImageIndex] : lightbox)}
                  />

                  {/* Navigation arrows - only show for before/after arrays */}
                  {Array.isArray(lightbox) && lightbox.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentImageIndex((prev) => prev === 0 ? lightbox.length - 1 : prev - 1)
                        }}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentImageIndex((prev) => prev === lightbox.length - 1 ? 0 : prev + 1)
                        }}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs md:text-sm px-3 py-1 rounded-full z-10">
                        {currentImageIndex + 1} / {lightbox.length}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Text side - only show if description exists */}
              {description?.desc && (
                <div
                  className="md:w-1/2 w-full bg-white overflow-y-auto p-6 md:p-8 max-h-[90vh]"
                  style={{ overscrollBehavior: 'contain' }}
                  onWheel={(e) => e.stopPropagation()}
                >
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