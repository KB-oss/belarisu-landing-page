'use client'

interface WayItem {
  icon: string
  title: string
  text: string
}

const WAYS: WayItem[] = [
  {
    icon: 'https://www.figma.com/api/mcp/asset/edcbc255-da22-4dc5-90c4-0444d1f8f057',
    title: 'In-kind donations',
    text: 'Make an immediate impact with a single gift.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/ab94f148-61f2-4104-8c7e-bffa9e203f19',
    title: 'Corporate Partnership',
    text: 'Partner with BMC as an organization. Corporate partnerships build lasting change.',
  },
  {
    icon: 'https://www.figma.com/api/mcp/asset/8f763915-390d-4356-a538-835ba47c65a3',
    title: 'Gift in Memory',
    text: "Make a donation in memory of a loved one or honor someone's legacy.",
  },
]

interface DonationSuccessProps {
  onClose: () => void
}

export default function DonationSuccess({ onClose }: DonationSuccessProps) {
  return (
    <div className="flex flex-col gap-6 p-8 flex-1 overflow-y-auto">
      {/* Success banner */}
      <div className="bg-[#fcfff1] rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(164,196,16,0.15)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#39b54a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[#005526] font-black text-xl">Donation Successful</p>
        <p className="text-muted text-sm leading-relaxed max-w-sm">
          In today's world of multiple crises, you can still make a difference in someone's life. Your support can give a child their first smile, their first word, their first chance to belong.
        </p>
      </div>

      {/* Other ways to give */}
      <div>
        <p className="text-navy font-black text-xl mb-4">Other Ways to Give</p>
        <div className="grid grid-cols-1 gap-3">
          {WAYS.map(({ icon, title, text }) => (
            <div key={title} className="bg-white border border-[#f1f5f9] rounded-2xl p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <img src={icon} alt="" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-navy font-black text-sm mb-1">{title}</p>
                <p className="text-muted text-xs leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-navy text-white font-black py-4 rounded-xl hover:bg-navy/90 transition-colors"
      >
        Close
      </button>
    </div>
  )
}
