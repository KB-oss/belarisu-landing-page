'use client'

import { useState } from 'react'

interface CardFormProps {
  amount: number
  onBack: () => void
  onSubmit: () => void
}

export default function CardForm({ amount, onBack, onSubmit }: CardFormProps) {
  const [coverFee, setCoverFee] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-5 p-8 flex-1 overflow-y-auto">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-muted hover:text-navy transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-navy font-black text-2xl tracking-tight">Enter your details</p>
      </div>

      {/* Payment method toggle */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm border-2 border-accent bg-[#fff4ee] text-accent font-semibold">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Credit card
        </div>
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center py-3 rounded-xl border border-[#ddd] hover:border-[#39b54a] transition-colors"
        >
          <img src="https://www.figma.com/api/mcp/asset/06041337-1b05-4cfa-b47b-58e2f939e7a0" alt="M-Pesa" className="h-5 object-contain" />
        </button>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#737373] text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Card info */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#737373] text-sm font-medium">Card information</label>
        <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]">
            <input placeholder="1234 1234 1234 1234" className="flex-1 text-sm outline-none text-[#737373] bg-transparent" />
            <div className="flex gap-1 text-[#ddd] text-xs">
              <span className="bg-[#1a1f71] text-white px-1 rounded text-[10px]">VISA</span>
              <span className="bg-black text-white px-1 rounded text-[10px]">MC</span>
            </div>
          </div>
          <div className="flex">
            <input placeholder="MM / YY" className="flex-1 px-4 py-3 text-sm outline-none text-[#737373] bg-transparent border-r border-[#e5e5e5]" />
            <input placeholder="CVC" className="flex-1 px-4 py-3 text-sm outline-none text-[#737373] bg-transparent" />
          </div>
        </div>
      </div>

      {/* Cardholder name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#737373] text-sm font-medium">Cardholder name</label>
        <input
          placeholder="Full name on card"
          className="border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#737373] text-sm font-medium">Country or region</label>
        <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
          <select className="w-full px-4 py-3 text-sm text-[#737373] bg-transparent outline-none border-b border-[#e5e5e5]">
            <option>United States</option>
            <option>Kenya</option>
            <option>Ethiopia</option>
            <option>Other</option>
          </select>
          <input placeholder="ZIP" className="w-full px-4 py-3 text-sm text-[#737373] bg-transparent outline-none" />
        </div>
      </div>

      {/* Cover fee */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={coverFee}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCoverFee(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <span className="text-sm text-black">Cover transaction costs</span>
        <span className="text-muted text-xs ml-auto">(+3%)</span>
      </label>

      {/* Donate */}
      <button
        onClick={onSubmit}
        className="w-full flex items-center justify-between bg-accent text-white font-black px-6 py-4 rounded-xl shadow-lg hover:bg-accent-dark transition-colors"
      >
        <span>Donate ${coverFee ? Math.round(amount * 1.03) : amount}</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
