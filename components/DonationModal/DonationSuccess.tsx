'use client'

const WAYS = [
  {
    title: 'In-kind Donations',
    text: 'Donate medical supplies, equipment, or professional services to support our care programs directly.',
    color: '#0ea5e9',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: 'Corporate Partnership',
    text: 'Partner with BMC as an organization. Corporate partnerships build lasting, systemic change.',
    color: '#8b5cf6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Gift in Memory',
    text: "Honor a loved one's legacy with a memorial donation that funds free cleft care for a child.",
    color: '#ec4899',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

interface DonationSuccessProps {
  onClose: () => void
}

export default function DonationSuccess({ onClose }: DonationSuccessProps) {
  return (
    <div className="flex flex-col p-6 sm:p-8 flex-1 overflow-y-auto gap-6">
      {/* Success banner */}
      <div className="rounded-2xl px-6 py-7 flex flex-col items-center gap-3 text-center" style={{ background: '#f0fdf4' }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(57,181,74,0.15)' }}>
          <svg className="w-7 h-7" style={{ color: '#39b54a' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-black text-[1.15rem] tracking-tight" style={{ color: '#005526' }}>
          Thank you — donation received!
        </p>
        <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#2d6a4f' }}>
          Your support can give a child their first smile, their first word, their first chance to belong.
        </p>
      </div>

      {/* Other ways */}
      <div>
        <p className="font-black text-base mb-3" style={{ color: '#071e36' }}>More ways to make an impact</p>
        <div className="flex flex-col gap-2.5">
          {WAYS.map(({ icon, title, text, color }) => (
            <div
              key={title}
              className="flex gap-4 items-start p-4 rounded-2xl border border-slate-100 hover:shadow-sm transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}18`, color }}
              >
                {icon}
              </div>
              <div>
                <p className="font-black text-sm mb-0.5" style={{ color: '#071e36' }}>{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full font-black py-3.5 rounded-xl text-sm transition-all hover:opacity-90"
        style={{ background: '#071e36', color: '#fff' }}
      >
        Close
      </button>
    </div>
  )
}
