// components/donation/MpesaForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';

const MPESA_LOGO = 'https://www.figma.com/api/mcp/asset/06041337-1b05-4cfa-b47b-58e2f939e7a0';

interface MpesaFormProps {
  amount: number;
  onBack: () => void;
  onSubmit: (success: boolean, checkoutId?: string) => void;
  onStatusUpdate?: (status: 'pending' | 'completed' | 'failed' | 'timeout', checkoutId?: string) => void;
}

export default function MpesaForm({ amount, onBack, onSubmit, onStatusUpdate }: MpesaFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'completed' | 'failed' | 'timeout'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  // Poll for status updates
  useEffect(() => {
    if (!checkoutId || status !== 'pending') return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutId}`);
      const data = await res.json();
      
      if (data.donation && data.donation.status !== 'pending') {
        setStatus(data.donation.status);
        onStatusUpdate?.(data.donation.status, checkoutId);
        
        if (data.donation.status === 'completed') {
          onSubmit(true, checkoutId);
        } else if (data.donation.status === 'failed' || data.donation.status === 'timeout') {
          onSubmit(false);
        }
        
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [checkoutId, status]);

  const handleSubmit = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    if (!name) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus('pending');
    onStatusUpdate?.('pending');

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          phoneNumber: phoneNumber,
          name: name
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCheckoutId(data.checkoutRequestId);
        onStatusUpdate?.('pending', data.checkoutRequestId);
      } else {
        setStatus('failed');
        setError(data.message || 'Payment initiation failed');
        onStatusUpdate?.('failed');
        onSubmit(false);
      }
    } catch (err) {
      setStatus('failed');
      setError('Network error. Please try again.');
      onStatusUpdate?.('failed');
      onSubmit(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
      return cleaned;
    }
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    return cleaned;
  };

  if (status === 'pending') {
    return (
      <div className="flex flex-col gap-5 p-8 flex-1">
        <div className="flex items-center gap-3">
          <button onClick={() => {
            setStatus('idle');
            setCheckoutId(null);
          }} className="text-muted hover:text-navy transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-navy font-black text-2xl tracking-tight">M-Pesa Payment</p>
        </div>

        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-ping absolute inset-0 bg-yellow-400 rounded-full opacity-75"></div>
              <Clock className="h-16 w-16 text-yellow-600 relative" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">Waiting for Payment</h3>
          <p className="text-gray-600">
            Please check your phone and enter your M-Pesa PIN to complete the donation of <strong>KES {amount.toLocaleString()}</strong>
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> In sandbox mode, you won't receive a real M-Pesa prompt. 
              The transaction will auto-complete in a few seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // if (status === 'completed') {
  //   return (
  //     <div className="flex flex-col gap-5 p-8 flex-1">
  //       <div className="text-center space-y-4 py-8">
  //         <div className="flex justify-center">
  //           <CheckCircle className="h-16 w-16 text-green-600" />
  //         </div>
  //         <h3 className="text-2xl font-bold text-green-700">Donation Successful!</h3>
  //         <p className="text-gray-600">
  //           Thank you for your donation of <strong>KES {amount.toLocaleString()}</strong>
  //         </p>
  //         <p className="text-sm text-gray-500">
  //           A receipt has been sent to {phoneNumber}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (status === 'failed' || status === 'timeout') {
    return (
      <div className="flex flex-col gap-5 p-8 flex-1">
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-red-700">
            {status === 'timeout' ? 'Payment Timeout' : 'Payment Failed'}
          </h3>
          <p className="text-gray-600">
            {error || 'The transaction could not be completed. Please try again.'}
          </p>
          <button
            onClick={() => {
              setStatus('idle');
              setError(null);
            }}
            className="mt-4 px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 hover:border-accent text-sm font-semibold text-slate-500 hover:text-accent transition-all"
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
        <label className="text-[#737373] text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          placeholder="0712345678 or 254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
          className="border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#39b54a] transition-colors"
        />
        <p className="text-xs text-gray-500">
          Enter the phone number registered with M-Pesa
        </p>
      </div>

      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-[1px]">Full Name</label>
        <input
          placeholder="Full name on M-Pesa account"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#e5e5e5] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#39b54a] transition-colors"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-[#efffe6] border border-[#39b54a]/30 rounded-xl p-4">
        <p className="text-sm text-[#005526] leading-relaxed">
          You will receive a push notification on your phone to confirm the payment of <strong>KES {amount.toLocaleString()}</strong> via M-Pesa.
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-auto w-full flex items-center justify-between bg-[#39b54a] text-white font-black px-6 py-4 rounded-xl shadow-lg hover:bg-[#2d9b3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>
          {isLoading ? (
            <>
              <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Donate KES ${amount.toLocaleString()} via M-Pesa`
          )}
        </span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  );
}
