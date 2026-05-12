'use client'

interface MpesaFormProps {
  amount: number
  onBack: () => void
  onSwitchToCard: () => void
  onSubmit: () => void
}

export default function MpesaForm({ amount, onBack, onSwitchToCard, onSubmit }: MpesaFormProps) {
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
          <p className="font-black text-[10px] tracking-[3px] uppercase" style={{ color: 'rgba(57,181,74,0.8)' }}>
            Secure Payment
          </p>
          <p className="font-black text-[1.3rem] tracking-tight leading-tight" style={{ color: '#071e36' }}>
            M-Pesa Details
          </p>
        </div>
      </div>

      {/* Method toggle */}
      <div className="flex gap-2">
        <button
          onClick={onSwitchToCard}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 hover:border-accent text-sm font-semibold text-slate-500 hover:text-accent transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Credit card
        </button>
        <div className="flex-1 flex items-center justify-center py-3 rounded-xl border-2 border-[#39b54a] bg-[#effce1]">
          <MPesaLogo />
        </div>
      </div>

      {/* Amount badge */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#f0fff4' }}>
        <svg className="w-4 h-4" style={{ color: '#39b54a' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-sm text-slate-500">Donating</span>
        <span className="font-black ml-auto" style={{ color: '#071e36' }}>${amount} USD</span>
      </div>

      {/* Phone number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Phone Number</label>
        <div
          className="flex border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-[#39b54a] transition-colors"
        >
          <div className="flex items-center px-3 border-r border-slate-200 bg-slate-50">
            <span className="text-sm font-semibold text-slate-500">+254</span>
          </div>
          <input
            type="tel"
            placeholder="7XX XXX XXX"
            className="flex-1 px-4 py-3 text-sm outline-none placeholder-slate-300 bg-transparent"
            style={{ color: '#071e36' }}
          />
        </div>
      </div>

      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Full Name</label>
        <input
          placeholder="Name on M-Pesa account"
          className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-slate-300"
          style={{ color: '#071e36' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#39b54a')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        />
      </div>

      {/* Info box */}
      <div
        className="flex gap-3 rounded-xl p-4"
        style={{ background: '#f0fff4', border: '1px solid rgba(57,181,74,0.25)' }}
      >
        <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#39b54a' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-sm leading-relaxed" style={{ color: '#1a5c2e' }}>
          You'll receive a push notification on your phone to confirm the payment of{' '}
          <strong>${amount}</strong> via M-Pesa STK Push.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        className="mt-auto w-full flex items-center justify-between text-white font-black px-6 py-4 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #39b54a 0%, #2a8a38 100%)' }}
      >
        <span>Donate ${amount} via M-Pesa</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured with end-to-end encryption
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
