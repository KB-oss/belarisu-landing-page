// components/donation/GiveOnce.tsx
'use client';

import { useState } from "react";

const PRESETS = [800, 450, 200, 100, 65, 25];
const MPESA_LOGO = 'https://www.figma.com/api/mcp/asset/06041337-1b05-4cfa-b47b-58e2f939e7a0';

type TabType = 'once' | 'monthly';
type PayMethod = 'card' | 'mpesa';

interface GiveOnceProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
  amount: number;
  setAmount: (amount: number) => void;
  payMethod: PayMethod;
  setPayMethod: (method: PayMethod) => void;
  onDonate: () => void;
}

export default function GiveOnce({ 
  tab, setTab, amount, setAmount, 
  payMethod, setPayMethod, onDonate 
}: GiveOnceProps) {
  const [custom, setCustom] = useState<string>('');
  const displayAmount = custom !== '' ? (parseFloat(custom) || 0) : amount;

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustom('');
  };

  return (
    <div className="flex flex-col gap-5 p-8 flex-1">
      <p className="text-navy font-black text-2xl tracking-tight">Secure Donation</p>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('once')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
            tab === 'once'
              ? 'bg-[#ffecdf] border-slate-800 text-black'
              : 'border-[#b8b8b8] text-black/70 hover:border-slate-800/50'
          }`}
        >
          Give once
        </button>
        <button
          onClick={() => setTab('monthly')}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
            tab === 'monthly'
              ? 'bg-[#ffecdf] border-slate-800 text-black'
              : 'border-[#b8b8b8] text-black/70 hover:border-slate-800/50'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((val) => (
          <button
            key={val}
            onClick={() => handlePreset(val)}
            className={`py-4 rounded-xl text-sm font-semibold border transition-all ${
              amount === val && custom === ''
                ? 'border-tangerine bg-[#ffecdf] text-navy'
                : 'border-[#ddd] text-black hover:border-tangerine/40'
            }`}
          >
            ${val}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex items-center border border-[#ddd] rounded-xl px-4 py-3 gap-2">
        <span className="text-xl font-semibold text-black">KES</span>
        <input
          type="number"
          value={custom}
          onChange={(e) => { 
            setCustom(e.target.value); 
            if (e.target.value) setAmount(parseFloat(e.target.value) || 0);
          }}
          placeholder={String(amount)}
          className="flex-1 text-xl font-semibold outline-none bg-transparent text-black placeholder-black/40"
          min="1"
        />
        <span className="text-muted text-sm">KES ▾</span>
      </div>

      {/* Payment method */}
      <div className="flex gap-2">
        <button
          onClick={() => setPayMethod('card')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm border transition-all ${
            payMethod === 'card' ? 'border-slate-800 bg-[#fff4ee] text-slate-800' : 'border-[#ddd] text-[#616161]'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
          Credit card
        </button>
        <button
          onClick={() => setPayMethod('mpesa')}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl border transition-all ${
            payMethod === 'mpesa' ? 'border-[#39b54a] bg-[#efffe6]' : 'border-[#ddd]'
          }`}
        >
          <img src={MPESA_LOGO} alt="M-Pesa" className="h-5 object-contain" />
        </button>
      </div>

      {/* Donate button */}
      <button
        onClick={onDonate}
        className="mt-auto w-full flex items-center justify-between bg-navy text-white font-black px-6 py-4 rounded-xl shadow-lg hover:bg-navy/90 transition-colors"
      >
        <span>Donate {displayAmount}</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}