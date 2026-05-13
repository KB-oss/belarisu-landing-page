'use client'

import { useState } from 'react'

interface CardFormProps {
  amount: number
  onBack: () => void
  onSwitchToMpesa: () => void
  onSubmit: () => void
}

export default function CardForm({ amount, onBack, onSwitchToMpesa, onSubmit }: CardFormProps) {
  const [coverFee, setCoverFee] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-8 flex-1">
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
            Secure Payment
          </p>
          <p className="font-black text-[1.3rem] tracking-tight leading-tight" style={{ color: '#071e36' }}>
            Card Details
          </p>
        </div>
      </div>

      {/* Method toggle */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 border-accent bg-[#fff4ee] text-accent">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Credit card
        </div>
        <button
          onClick={onSwitchToMpesa}
          className="flex-1 flex items-center justify-center py-3 rounded-xl border-2 border-slate-200 hover:border-[#39b54a] transition-colors"
        >
          <MPesaLogo />
        </button>
      </div>

      {/* Amount badge */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#f8fafc' }}>
        <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-sm text-slate-500">Donating</span>
        <span className="font-black ml-auto" style={{ color: '#071e36' }}>${amount} USD</span>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder-slate-300"
          style={{ color: '#071e36' }}
        />
      </div>

      {/* Card info */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Card information</label>
        <div className="border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-accent transition-colors">
          <div className="flex items-center px-4 py-3 border-b border-slate-100">
            <input
              placeholder="1234 1234 1234 1234"
              className="flex-1 text-sm outline-none placeholder-slate-300 bg-transparent"
              style={{ color: '#071e36' }}
            />
            <div className="flex gap-1">
              <span className="bg-[#1a1f71] text-white px-1.5 py-0.5 rounded text-[9px] font-black">VISA</span>
              <span className="bg-black text-white px-1.5 py-0.5 rounded text-[9px] font-black">MC</span>
            </div>
          </div>
          <div className="flex">
            <input
              placeholder="MM / YY"
              className="flex-1 px-4 py-3 text-sm outline-none placeholder-slate-300 bg-transparent border-r border-slate-100"
              style={{ color: '#071e36' }}
            />
            <input
              placeholder="CVC"
              className="flex-1 px-4 py-3 text-sm outline-none placeholder-slate-300 bg-transparent"
              style={{ color: '#071e36' }}
            />
          </div>
        </div>
      </div>

      {/* Cardholder name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Cardholder name</label>
        <input
          placeholder="Full name on card"
          className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder-slate-300"
          style={{ color: '#071e36' }}
        />
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Country</label>
        <select
          className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors appearance-none bg-white"
          style={{ color: '#071e36' }}
        >
          <option>United States</option>
          <option>Kenya</option>
          <option>Ethiopia</option>
          <option>United Kingdom</option>
          <option>Other</option>
        </select>
      </div>

      {/* Cover fee */}
      <label className="flex items-center gap-3 cursor-pointer py-1">
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0"
          style={{
            background: coverFee ? '#ff7518' : '#fff',
            borderColor: coverFee ? '#ff7518' : '#cbd5e1',
          }}
          onClick={() => setCoverFee((v) => !v)}
        >
          {coverFee && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <input type="checkbox" checked={coverFee} onChange={(e) => setCoverFee(e.target.checked)} className="sr-only" />
        <span className="text-sm text-slate-600">Cover processing fees (3%)</span>
        <span className="text-xs text-slate-400 ml-auto">+${Math.round(amount * 0.03)}</span>
      </label>

      {/* Submit */}
      <button
        onClick={onSubmit}
        className="w-full flex items-center justify-between text-white font-black px-6 py-4 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #ff7518 0%, #e55d00 100%)' }}
      >
        <span>Donate ${coverFee ? Math.round(amount * 1.03) : amount}</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured with 256-bit SSL encryption
      </p>
    </div>
  )
}

function MPesaLogo() {
  return (
    <span className="font-black" style={{ fontSize: '14px', color: '#39b54a', letterSpacing: '-0.3px' }}>
      M-<span style={{ letterSpacing: '0.5px' }}>PESA</span>
    </span>
  )
}
