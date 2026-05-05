// components/booking/ConfirmationStep.tsx
'use client';

import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, User, Stethoscope, DollarSign, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/app/actions/booking';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ConfirmationStepProps {
  onBack: () => void;
}

// Review Card Component
interface ReviewCardProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}



function ReviewCard({ title, onEdit, children }: ReviewCardProps) {
  
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ border: '1px solid #e0e0e0' }}>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: '#f8fafc', borderBottom: '1px solid #e0e0e0' }}
      >
        <p className="font-bold text-[13px]" style={{ color: '#071e36' }}>{title}</p>
        <button
          onClick={onEdit}
          className="text-[12px] font-semibold transition-colors hover:text-[#ff7518]"
          style={{ color: '#62748e' }}
        >
          Edit
        </button>
      </div>
      <div className="px-5 py-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

interface ReviewRowProps {
  label: string;
  value: string;
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span style={{ color: '#62748e' }}>{label}</span>
      <span className="font-semibold" style={{ color: '#071e36' }}>{value || '—'}</span>
    </div>
  );
}

function CheckIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ConfirmationStep({ onBack }: ConfirmationStepProps) {
  const router = useRouter();
  const { data, resetBooking, updateConfirmation } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terms, setTerms] = useState(data.confirmation.termsAccepted);
  const [done, setDone] = useState<boolean>(false)


  const handleConfirm = async () => {
    if (!terms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    updateConfirmation({ termsAccepted: true });
    setIsSubmitting(true);

    try {
      const result = await createBooking({
        service: data.service!,
        selectedDoctor: data.doctorSelection.doctorId!,
        selectedSlot: data.doctorSelection.selectedSlot!,
        patientDetails: data.patientDetails,
        contactPreferences: data.contactPreferences,
      });

      if (result.success) {
        setDone(true);
        resetBooking();
        // router.push('/booking/success');
        toast.success('Booking confirmed! Check your email for details');
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceName = (service: string) => {
    const services: Record<string, string> = {
      'ent-care': 'ENT Care',
      'orthodontics-dental': 'Orthodontics & Dental',
      'surgery': 'Surgery',
      'speech-therapy': 'Speech Therapy',
      'nutritional-support': 'Nutritional Support',
      'psychosocial-care': 'Psychosocial Care',
      'general-assessment': 'General Assessment',
    };
    return services[service] || service;
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    const groups: Record<string, string> = {
      '0-12-months': '0–12 months',
      '1-3-years': '1–3 years',
      '4-12-years': '4–12 years',
      '13-17-years': '13–17 years',
      '18-plus': '18+ adult',
    };
    return groups[ageGroup] || ageGroup;
  };

  const getContactMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      phone: 'Phone Call',
      email: 'Email',
      whatsapp: 'WhatsApp',
      'walk-in': 'Walk-in',
    };
    return methods[method] || method;
  };

  const goToStep = (step: number) => {
    const { setStep } = useBookingStore.getState();
    setStep(step);
  };

  if (done) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="text-center max-w-md px-8 py-12"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-7"
          style={{ background: 'rgba(255,117,24,0.10)' }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
        >
          <svg className="w-10 h-10" style={{ color: '#ff7518' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        
        <h2 className="font-black text-[#071e36] tracking-[-0.03em] mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>
          Booking{' '}
          <p className="not-italic" style={{ color: '#ff7518', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Requested!</p>
        </h2>
        
        <p className="text-[14px] leading-[1.85] mb-8" style={{ color: '#62748e' }}>
          Thank you, <strong className="text-[#071e36]">{data.patientDetails.firstName}</strong>. Our team will confirm your{' '}
          <strong className="text-[#071e36]">{getServiceName(data.service!)}</strong> appointment within 24 hours. All care at BMC is completely free.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white font-black text-[13px] px-8 py-3.5 rounded-full transition-all hover:-translate-y-px"
          style={{ background: '#ff7518', boxShadow: '0 4px 18px rgba(255,117,24,0.30)' }}
        >
          Back to Home
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>
          Step 4 of 4
        </p>
        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)' }}>
          Review your <span style={{ color: '#ff7518' }}>appointment</span>
        </h2>
        <p className="text-[14px] leading-[1.7]" style={{ color: '#62748e' }}>
          Check everything looks right. You can go back to edit any section.
        </p>
      </div>

      {/* Service Section */}
      <ReviewCard title="Service Requested" onEdit={() => goToStep(1)}>
        <ReviewRow label="Service" value={getServiceName(data.service!)} />
      </ReviewCard>

      {/* Doctor Section */}
      {data.doctorSelection.doctor && data.doctorSelection.selectedSlot && (
        <ReviewCard title="Doctor & Appointment" onEdit={() => goToStep(3)}>
          <ReviewRow label="Doctor" value={`Dr. ${data.doctorSelection.doctor.name}`} />
          <ReviewRow label="Specialty" value={data.doctorSelection.doctor.specialty} />
          <ReviewRow
            label="Date & Time"
            value={`${data.doctorSelection.selectedSlot.day || (data.doctorSelection.selectedSlot.date && format(data.doctorSelection.selectedSlot.date, 'EEEE'))}, ${data.doctorSelection.selectedSlot.time}`}
          />
          {data.doctorSelection.doctor.consultation_fee > 0 && (
            <ReviewRow label="Consultation Fee" value={`$${data.doctorSelection.doctor.consultation_fee}`} />
          )}
        </ReviewCard>
      )}

      {/* Patient Details Section */}
      <ReviewCard title="Patient Information" onEdit={() => goToStep(2)}>
        <ReviewRow label="Full Name" value={`${data.patientDetails.firstName} ${data.patientDetails.lastName}`} />
        <ReviewRow label="Age Group" value={getAgeGroupLabel(data.patientDetails.ageGroup!)} />
        <ReviewRow label="Phone Number" value={data.patientDetails.phoneNumber} />
        {data.patientDetails.email && <ReviewRow label="Email Address" value={data.patientDetails.email} />}
        {data.patientDetails.briefDescription && (
          <div className="flex items-start justify-between text-[13px]">
            <span style={{ color: '#62748e' }}>Notes</span>
            <span className="font-normal text-right max-w-[60%]" style={{ color: '#071e36' }}>
              {data.patientDetails.briefDescription}
            </span>
          </div>
        )}
      </ReviewCard>

      {/* Contact Preferences Section */}
      <ReviewCard title="Contact Preferences" onEdit={() => goToStep(3)}>
        <ReviewRow label="Contact Method" value={getContactMethodLabel(data.contactPreferences.contactMethod!)} />
      </ReviewCard>

      {/* Terms and Conditions */}
      <label className="flex items-start gap-3 cursor-pointer mt-2">
        <div
          className="mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all duration-200"
          style={{ borderColor: terms ? '#071e36' : '#e0e0e0', background: terms ? '#071e36' : '#fff' }}
          onClick={() => setTerms(!terms)}
        >
          {terms && <CheckIcon className="w-3 h-3 text-white" />}
        </div>
        <p className="text-[13px] leading-[1.7]" style={{ color: '#62748e' }}>
          I confirm that the details above are accurate and I agree to BMC's patient care terms.
          I understand that this is an appointment request and will be confirmed by the BMC team within 24 hours.
        </p>
      </label>

      {/* Footer with Back and Confirm buttons */}
      <div className="flex justify-between items-center pt-4 mt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full text-[13px] font-semibold px-6 py-2.5"
          style={{ borderColor: '#e0e0e0', color: '#62748e' }}
        >
          ← Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!terms || isSubmitting}
          className="rounded-full text-[13px] font-black px-7 py-2.5 transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: terms && !isSubmitting ? '#ff7518' : '#e0e0e0',
            color: terms && !isSubmitting ? '#fff' : '#62748e',
            boxShadow: terms && !isSubmitting ? '0 4px 18px rgba(255,117,24,0.30)' : 'none',
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin inline mr-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Confirming...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </div>
  );
}