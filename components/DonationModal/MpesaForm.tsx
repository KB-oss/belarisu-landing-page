'use client'

const MPESA_LOGO = 'https://www.figma.com/api/mcp/asset/06041337-1b05-4cfa-b47b-58e2f939e7a0'

interface MpesaFormProps {
  amount: number
  onBack: () => void
  onSubmit: () => void
}

export default function MpesaForm({ amount, onBack, onSubmit }: MpesaFormProps) {
  return (
    <div className="flex flex-col gap-5 p-8 flex-1">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-muted hover:text-navy transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-navy font-black text-2xl tracking-tight">M-Pesa Details</p>
      </div>

      {/* Payment method toggle */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#ddd] text-[#616161] text-sm hover:border-accent transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Credit card
        </button>
        <div className="flex-1 flex items-center justify-center py-3 rounded-xl border-2 border-[#39b54a] bg-[#efffe6]">
          <img src={MPESA_LOGO} alt="M-Pesa" className="h-5 object-contain" />
        </div>
      </div>

      {/* Phone number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#737373] text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          placeholder="+254 7XX XXX XXX"
          className="border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#39b54a] transition-colors"
        />
      </div>

      {/* Cardholder name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[#737373] text-sm font-medium">Full Name</label>
        <input
          placeholder="Full name on account"
          className="border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#39b54a] transition-colors"
        />
      </div>

      <div className="bg-[#efffe6] border border-[#39b54a]/30 rounded-xl p-4">
        <p className="text-sm text-[#005526] leading-relaxed">
          You will receive a push notification on your phone to confirm the payment of <strong>${amount}</strong> via M-Pesa.
        </p>
      </div>

      <button
        onClick={onSubmit}
        className="mt-auto w-full flex items-center justify-between bg-[#39b54a] text-white font-black px-6 py-4 rounded-xl shadow-lg hover:bg-[#2d9b3c] transition-colors"
      >
        <span>Donate ${amount} via M-Pesa</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
