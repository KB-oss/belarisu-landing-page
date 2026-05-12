'use client'

import { useState } from 'react'

const PRESETS = [800, 450, 200, 100, 65, 25]

type TabType = 'once' | 'monthly'
type PayMethod = 'card' | 'mpesa'

const OTHER_WAYS = [
  {
    label: 'In-kind',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: 'Corporate',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'In Memory',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
]

interface GiveOnceProps {
  tab: TabType
  setTab: (tab: TabType) => void
  amount: number
  setAmount: (amount: number) => void
  payMethod: PayMethod
  setPayMethod: (method: PayMethod) => void
  onDonate: () => void
  onOtherWays: () => void
}

export default function GiveOnce({
  tab, setTab, amount, setAmount, payMethod, setPayMethod, onDonate, onOtherWays,
}: GiveOnceProps) {
  const [custom, setCustom] = useState<string>('')
  const displayAmount = custom !== '' ? (parseFloat(custom) || 0) : amount

  const handlePreset = (val: number) => {
    setAmount(val)
    setCustom('')
  }

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-8 flex-1">
      {/* Header */}
      <div>
        <p className="font-black text-[10px] tracking-[3px] uppercase mb-1" style={{ color: 'rgba(255,117,24,0.7)' }}>
          Secure Donation
        </p>
        <h2 className="font-black text-[1.45rem] tracking-tight" style={{ color: '#071e36' }}>
          Make an Impact
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f1f5f9' }}>
        {(['once', 'monthly'] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#071e36' : '#94a3b8',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {t === 'once' ? 'Give once' : 'Give monthly'}
          </button>
        ))}
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((val) => (
          <button
            key={val}
            onClick={() => handlePreset(val)}
            className="py-3.5 rounded-xl text-sm font-bold border-2 transition-all"
            style={{
              borderColor: amount === val && custom === '' ? '#ff7518' : '#e5e7eb',
              background: amount === val && custom === '' ? '#fff4ee' : '#fff',
              color: amount === val && custom === '' ? '#ff7518' : '#0f172a',
            }}
          >
            ${val}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div
        className="flex items-center rounded-xl px-4 py-3 gap-2 border-2 transition-all"
        style={{ borderColor: custom ? '#ff7518' : '#e5e7eb' }}
      >
        <span className="font-bold text-lg" style={{ color: '#071e36' }}>$</span>
        <input
          type="number"
          value={custom}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCustom(e.target.value)
            if (e.target.value) setAmount(parseFloat(e.target.value) || 0)
          }}
          placeholder={String(amount)}
          className="flex-1 text-lg font-bold outline-none bg-transparent placeholder-black/30"
          style={{ color: '#071e36' }}
          min="1"
        />
        <span className="text-xs font-semibold text-slate-400">USD</span>
      </div>

      {/* Payment method */}
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-[1.5px]">Pay with</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPayMethod('card')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{
              borderColor: payMethod === 'card' ? '#ff7518' : '#e5e7eb',
              background: payMethod === 'card' ? '#fff4ee' : '#fff',
              color: payMethod === 'card' ? '#ff7518' : '#64748b',
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Credit card
          </button>
          <button
            onClick={() => setPayMethod('mpesa')}
            className="flex-1 flex items-center justify-center py-3 rounded-xl border-2 transition-all"
            style={{
              borderColor: payMethod === 'mpesa' ? '#39b54a' : '#e5e7eb',
              background: payMethod === 'mpesa' ? '#effce1' : '#fff',
            }}
          >
            <MPesaLogo />
          </button>
        </div>
      </div>

      {/* Donate CTA */}
      <button
        onClick={onDonate}
        className="w-full flex items-center justify-between text-white font-black px-6 py-4 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #071e36 0%, #0d3460 100%)' }}
      >
        <span>Donate ${displayAmount}</span>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-100" />
        <p className="text-xs text-slate-400 font-medium whitespace-nowrap">or explore other ways</p>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Other Ways grid */}
      <div className="grid grid-cols-3 gap-2">
        {OTHER_WAYS.map(({ icon, label }) => (
          <button
            key={label}
            onClick={onOtherWays}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-accent/30 hover:bg-orange-50/50 transition-all group text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-accent/10 flex items-center justify-center text-slate-400 group-hover:text-accent transition-all">
              {icon}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-navy leading-tight transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>
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
