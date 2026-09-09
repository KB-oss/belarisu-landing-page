import React from 'react'

const NAVY = '#071e36'
const ORANGE = '#ff7518'
const WRAP = 'w-full max-w-[1366px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20'

/* Shared chrome for /privacy-policy and /terms-of-service. Prose is styled off
   the wrapper so the page files stay readable as documents. */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fdfcfb' }}>
      <section style={{ background: NAVY }}>
        <div className={`${WRAP} pt-[124px] pb-14 lg:pt-[168px] lg:pb-20`}>
          <p className="font-black uppercase tracking-[3px] mb-5" style={{ fontSize: '10px', color: ORANGE }}>
            {eyebrow}
          </p>
          <h1 className="text-white font-black leading-[1.02] tracking-tight mb-6" style={{ fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)' }}>
            {title}
          </h1>
          <p className="text-[15px] leading-relaxed max-w-[62ch]" style={{ color: 'rgba(255,255,255,0.76)' }}>
            {intro}
          </p>
          <p className="text-[12.5px] mt-7 pt-6" style={{ color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.16)' }}>
            Last updated {updated}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className={WRAP}>
          <div
            className="max-w-[72ch]
              [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-[20px] [&_h2]:sm:text-[23px] [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:first:mt-0
              [&_h3]:font-black [&_h3]:text-[15px] [&_h3]:mt-8 [&_h3]:mb-2.5
              [&_p]:text-[14.5px] [&_p]:leading-[1.85] [&_p]:mb-4
              [&_ul]:mb-5 [&_ul]:space-y-2.5 [&_ul]:pl-0
              [&_li]:text-[14.5px] [&_li]:leading-[1.8] [&_li]:pl-5 [&_li]:relative
              [&_a]:underline [&_a]:underline-offset-2"
            style={{ color: '#45556c' }}
          >
            <style>{`
              .legal-body h2, .legal-body h3 { color: ${NAVY}; }
              .legal-body a { color: ${ORANGE}; }
              .legal-body li::before {
                content: ''; position: absolute; left: 0; top: 0.72em;
                width: 5px; height: 5px; border-radius: 9999px; background: ${ORANGE};
              }
            `}</style>
            <div className="legal-body">{children}</div>
          </div>
        </div>
      </section>
    </div>
  )
}
