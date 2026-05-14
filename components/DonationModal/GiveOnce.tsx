// components/donation/GiveOnce.tsx
'use client';

import { useState } from "react";

const PRESETS = [800, 450, 200, 100, 65, 25];
const MPESA_LOGO = './mpesaLogo.png';

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
        <span className="text-md font-semibold text-[#071e36]">KES</span>
        <input
          type="number"
          value={custom}
          onChange={(e) => { 
            setCustom(e.target.value); 
            if (e.target.value) setAmount(parseFloat(e.target.value) || 0);
          }}
          placeholder={String(amount)}
          className="flex-1 text-lg font-bold outline-none bg-transparent placeholder-black/30"
          style={{ color: '#071e36' }}
          min="1"
        />
        <span className="text-muted text-sm">KES</span>
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
          <img src={MPESA_LOGO} alt="M-Pesa" className="w-25 h-10 object-contain" />
        </button>
      </div>

      {/* Donate CTA */}
      <button
        onClick={onDonate}
        className="w-full flex items-center justify-between text-white font-black px-6 py-4 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #071e36 0%, #0d3460 100%)' }}
      >
        <span>Donate {displayAmount}</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
