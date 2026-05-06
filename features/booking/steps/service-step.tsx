'use client';

import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 'surgery',
    title: 'Surgery',
    description: 'Cleft lip & palate surgical repair',
  },
  {
    id: 'ent-care',
    title: 'ENT Care',
    description: 'Ear, nose & throat health',
  },
  {
    id: 'orthodontics-dental',
    title: 'Orthodontics & Dental',
    description: 'Jaw development & dental alignment',
  },
  {
    id: 'speech-therapy',
    title: 'Speech Therapy',
    description: 'Communication & speech development',
  },
  {
    id: 'nutritional-support',
    title: 'Nutritional Support',
    description: 'Feeding guidance & growth monitoring',
  },
  {
    id: 'psychosocial-care',
    title: 'Psychosocial Care',
    description: 'Counseling for patients & families',
  },
];

// Service icons as SVG
const SVC_ICON: Record<string, React.ReactNode> = {
  surgery: (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
    </svg>
  ),
  'ent-care': (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 4C8.5 4 5 7 5 11c0 2 .8 3.5 2 4.5L7 20h2.5l.5-2.5c.3.1.7.1 1 .1a5 5 0 005-5V8c0-2-1.5-4-4-4z"/>
    </svg>
  ),
  'orthodontics-dental': (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9c0-2 1.5-4 4-4 1.5 0 2.5.8 3 2 .5-1.2 1.5-2 3-2 2.5 0 4 2 4 4 0 2-.5 4-1.5 6-.5 1-1 2-1.5 2s-1-.5-1.5-2L12 12l-1.5 3c-.5 1.5-1 2-1.5 2s-1-1-1.5-2C4.5 13 3 11 3 9z"/>
      <path d="M9 9h6"/>
    </svg>
  ),
  'speech-therapy': (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  'nutritional-support': (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
      <path d="M12 2c2 4 2 8 0 12M12 2C8 6 8 10 12 14"/>
      <path d="M22 2l-5 5"/>
    </svg>
  ),
  'psychosocial-care': (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="7" r="4"/>
      <path d="M3 21v-1a9 9 0 0118 0v1"/>
      <path d="M9.5 7c0-.8.7-1.5 1.5-1.5"/>
    </svg>
  ),
};

interface ServiceStepProps {
  onNext: () => void;
}

export function ServiceStep({ onNext }: ServiceStepProps) {
  const { data, updateService } = useBookingStore();
  const [selectedService, setSelectedService] = React.useState(data.service);
  const [error, setError] = React.useState<string>('');

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId as any);
    setError('');
  };

  const handleContinue = () => {
    if (!selectedService) {
      setError('Please select a service to continue');
      return;
    }
    updateService(selectedService);
    onNext();
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 sm:px-0">
      <div>
        <p className="text-[10px] sm:text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>
          Step 1 of 4
        </p>
        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2 leading-tight" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.75rem)' }}>
          Which <span style={{ color: '#ff7518' }}>service</span> do you need?
        </h2>
        <p className="text-[12px] sm:text-[14px] leading-[1.6] sm:leading-[1.7]" style={{ color: '#62748e' }}>
          Select the service that best describes why you're visiting. Not sure? That's fine — just
          pick the closest one.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {services.map((service, index) => {
          const selected = selectedService === service.id;
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleServiceSelect(service.id)}
              className={`text-left p-3 sm:p-4 rounded-[12px] sm:rounded-[14px] border-2 transition-all duration-200 relative cursor-pointer w-full ${
                selected ? 'ring-2 ring-[#ff7518]/20' : ''
              }`}
              style={{
                borderColor: selected ? '#071e36' : '#e0e0e0',
                background: selected ? 'rgba(7,30,54,0.04)' : '#fff',
              }}
            >
              {selected && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center" style={{ background: '#071e36' }}>
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
              )}
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] flex items-center justify-center mb-2 sm:mb-3"
                style={{
                  background: selected ? 'rgba(7,30,54,0.08)' : '#f1f5f9',
                  color: selected ? '#071e36' : '#62748e',
                }}
              >
                {SVC_ICON[service.id]}
              </div>
              <p className="font-bold text-[13px] sm:text-[14px] mb-0.5 truncate" style={{ color: selected ? '#071e36' : '#171717' }}>
                {service.title}
              </p>
              <p className="text-[10px] sm:text-[12px] leading-tight sm:leading-normal" style={{ color: '#62748e' }}>
                {service.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <p className="text-[11px] sm:text-[12px] mt-1 sm:mt-2" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}

      {/* Footer with Back button and Continue button */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 mt-2 border-t border-[#f1f5f9]">
        <Link
          href="/"
          className="flex items-center justify-center sm:justify-start gap-2 font-semibold text-[12px] sm:text-[13px] transition-colors hover:text-[#071e36] px-3 sm:px-4 py-2 rounded-full"
          style={{ color: '#62748e' }}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to site
        </Link>
        <Button
          onClick={handleContinue}
          disabled={!selectedService}
          className="rounded-full text-[12px] sm:text-[13px] font-black px-5 sm:px-7 py-2 sm:py-2.5 transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
          style={{
            background: selectedService ? '#ff7518' : '#e0e0e0',
            color: selectedService ? '#fff' : '#62748e',
            boxShadow: selectedService ? '0 4px 18px rgba(255,117,24,0.30)' : 'none',
          }}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}