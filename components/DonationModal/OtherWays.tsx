'use client'

const WAYS = [
  {
    title: 'In-kind Donations',
    desc: "Donate medical supplies, surgical equipment, medicines, or professional services. Every item directly supports a patient's care journey.",
    howTo: "Email us with a description of what you'd like to donate and we'll coordinate the logistics.",
    color: '#0ea5e9',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: 'Corporate Partnership',
    desc: "Align your brand with purpose. Corporate partners fund surgeries, sponsor outreach events, and join BMC's mission across Africa.",
    howTo: 'Reach out to discuss partnership tiers, impact reports, and co-branding opportunities.',
    color: '#8b5cf6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Gift in Memory',
    desc: "Honor the memory of a loved one or celebrate a milestone by making a donation in their name. We'll send a tribute card to the family.",
    howTo: "Contact us with the name of your honoree and we'll create a personalized tribute.",
    color: '#ec4899',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

interface OtherWaysProps {
  onBack: () => void
  onClose: () => void
}

export default function OtherWays({ onBack, onClose: _onClose }: OtherWaysProps) {
  return (
    <div className="flex flex-col p-6 sm:p-8 flex-1 gap-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy transition-all"
          aria-label="Back"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="font-black text-[10px] tracking-[3px] uppercase" style={{ color: 'rgba(255,117,24,0.7)' }}>
            More Ways to Help
          </p>
          <p className="font-black text-[1.3rem] tracking-tight leading-tight" style={{ color: '#071e36' }}>
            Other Ways to Give
          </p>
        </div>
      </div>

      {/* Ways */}
      <div className="flex flex-col gap-4">
        {WAYS.map(({ title, desc, howTo, color, icon }) => (
          <div key={title} className="rounded-2xl p-5 border border-slate-100" style={{ background: '#fafafa' }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: `${color}18`, color }}
              >
                {icon}
              </div>
              <p className="font-black text-base" style={{ color: '#071e36' }}>{title}</p>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-2">{desc}</p>
            <p className="text-xs text-slate-400 italic">{howTo}</p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#071e36' }}>
        <p className="font-black text-white text-sm">Get in touch</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Our team is ready to help you find the best way to make an impact.
        </p>
        <a
          href="mailto:info@belarisumedical.org"
          className="inline-flex items-center gap-2 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all hover:opacity-90 self-start"
          style={{ background: '#ff7518' }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,12 2,6" />
          </svg>
          Contact us
        </a>
      </div>

      <button
        onClick={onBack}
        className="w-full font-bold py-3 rounded-xl text-sm text-slate-500 hover:text-navy border border-slate-200 hover:border-slate-400 transition-all"
      >
        ← Back to donation
      </button>
    </div>
  )
}
