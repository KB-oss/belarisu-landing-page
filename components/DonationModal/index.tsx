// components/donation/DonationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiveOnce from './GiveOnce';
import CardForm from './CardForm';
import MpesaForm from './MpesaForm';
import DonationSuccess from './DonationSuccess';

const PANEL_IMG = 'https://www.figma.com/api/mcp/asset/43c860bf-569c-4c85-8fc6-e1206952b560';

const FAQ_LINKS = [
  'Is my donation secure?',
  'Is this donation tax-deductible?',
  'Can I cancel my recurring donation?',
];

type ModalState = 'amount' | 'card' | 'mpesa' | 'success';
type TabType = 'once' | 'monthly';
type PayMethod = 'card' | 'mpesa';
type PaymentStatus = 'idle' | 'pending' | 'completed' | 'failed' | 'timeout';


interface DonationModalProps {
  onClose: () => void;
}

export default function DonationModal({ onClose }: DonationModalProps) {
  const [state, setState] = useState<ModalState>('amount');
  const [tab, setTab] = useState<TabType>('once');
  const [amount, setAmount] = useState<number>(100);
  const [payMethod, setPayMethod] = useState<PayMethod>('mpesa'); // Default to M-Pesa
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [completedAmount, setCompletedAmount] = useState<number>(0);
  const [completedPhone, setCompletedPhone] = useState<string>('');

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDonate = () => {
    if (payMethod === 'card') {
      setState('card');
    } else {
      setState('mpesa');
    }
  };

  const handleMpesaSubmit = (success: boolean, checkoutId?: string) => {
    if (success) {
      setState('success');
      // Auto close after 5 seconds on success
      setTimeout(() => {
        onClose();
      }, 5000);
    } else {
      setState('amount');
    }
  };

  const handleMpesaStatusChange = (status: PaymentStatus, checkoutId?: string) => {
    setPaymentStatus(status);

    // If payment completed, we can auto-close after showing success
    if (status === 'completed') {
      setCompletedAmount(amount);
      // Navigate to success screen after a brief delay
      setTimeout(() => {
        setState('success');
      }, 1000);
    } else if (status === 'failed' || status === 'timeout') {
      // Stay in mpesa form to show error/try again
      console.log('Payment failed');
    }
  };

  const handleCardSubmit = () => {
    setState('success');
    setTimeout(() => {
      onClose();
    }, 5000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(7,30,54,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="relative w-full sm:max-w-[980px] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '95dvh' }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/70 hover:text-white bg-black/25 hover:bg-black/40 rounded-full p-2 transition-all"
          aria-label="Close"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-full">
          {/* Left panel */}
          <div className="hidden md:flex relative w-[340px] xl:w-[380px] shrink-0">
            <img src={PANEL_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(160deg, rgba(7,30,54,0.1) 0%, rgba(7,30,54,0.78) 100%)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-7 py-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-8 rounded-full bg-accent" />
                <p className="font-black text-[10px] tracking-[3px] uppercase" style={{ color: 'rgba(255,117,24,0.85)' }}>
                  Bela Risu Foundation
                </p>
              </div>
              <p
                className="text-white font-black leading-[1.1] mb-3"
                style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', letterSpacing: '-0.8px' }}
              >
                Give a Child<br />Their <em className="not-italic text-accent">First Smile</em>
              </p>
              <p className="text-white/70 text-sm leading-relaxed italic">
                "The care we couldn't afford was made possible because someone, somewhere chose to give."
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden" style={{ maxHeight: '95dvh' }}>
            <AnimatePresence mode="wait">
              {state === 'amount' && (

                <motion.div key="amount" className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <GiveOnce
                    tab={tab}
                    setTab={setTab}
                    amount={amount}
                    setAmount={setAmount}
                    payMethod={payMethod}
                    setPayMethod={setPayMethod}
                    onDonate={handleDonate}
                  />
                </motion.div>
              )}

              {state === 'card' && (
                <motion.div key="card" className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <CardForm
                    amount={amount}
                    onBack={() => setState('amount')}
                    onSubmit={handleCardSubmit}
                    onSwitchToMpesa={() => setState('mpesa')}
                  />
                </motion.div>
              )}

              {state === 'mpesa' && (
                <motion.div key="mpesa" className="flex flex-col flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <MpesaForm
                    amount={amount}
                    onBack={() => setState('amount')}
                    onSubmit={handleMpesaSubmit}
                    onStatusUpdate={handleMpesaStatusChange}

                  />
                </motion.div>
              )}

              {state === 'success' && (
                <motion.div key="success" className="flex flex-col flex-1"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <DonationSuccess onClose={onClose} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}