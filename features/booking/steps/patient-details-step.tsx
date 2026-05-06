'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientDetailsSchema, PatientDetailsFormData, AgeGroup } from '@/validations/booking-schema';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const ageGroups = [
  { value: '0-12-months', label: '0–12', sub: 'months' },
  { value: '1-3-years', label: '1–3', sub: 'years' },
  { value: '4-12-years', label: '4–12', sub: 'years' },
  { value: '13-17-years', label: '13–17', sub: 'years' },
  { value: '18-plus', label: '18+', sub: 'adult' },
];

interface PatientDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PatientDetailsStep({ onNext, onBack }: PatientDetailsStepProps) {
  const { data, updatePatientDetails } = useBookingStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientDetailsFormData>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: {
      firstName: data.patientDetails.firstName,
      lastName: data.patientDetails.lastName,
      ageGroup: data.patientDetails.ageGroup || undefined,
      phoneNumber: data.patientDetails.phoneNumber,
      email: data.patientDetails.email,
      briefDescription: data.patientDetails.briefDescription,
    },
    mode: 'onChange',
  });

  const ageGroup = watch('ageGroup');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const phoneNumber = watch('phoneNumber');

  const isFormValid = !!firstName && !!lastName && !!ageGroup && !!phoneNumber;

  const onSubmit = (formData: PatientDetailsFormData) => {
    if (!isFormValid) return;
    updatePatientDetails({
      firstName: formData.firstName,
      lastName: formData.lastName,
      ageGroup: formData.ageGroup,
      phoneNumber: formData.phoneNumber,
      email: formData.email || '',
      briefDescription: formData.briefDescription || '',
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6  sm:px-0">
      <div>
        <p className="text-[10px] sm:text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>
          Step 2 of 4
        </p>
        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2 leading-tight" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.75rem)' }}>
          Patient <span style={{ color: '#ff7518' }}>details</span>
        </h2>
        <p className="text-[12px] sm:text-[14px] leading-[1.6] sm:leading-[1.7]" style={{ color: '#62748e' }}>
          Tell us about the person who needs care. All fields marked * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
            First Name <span style={{ color: '#ff7518' }}>*</span>
          </Label>
          <Input
            {...register('firstName')}
            placeholder="e.g. Amara"
            className={`rounded-[8px] text-[13px] sm:text-[14px] border ${
              errors.firstName ? 'border-red-500' : 'border-[#e0e0e0]'
            } focus:border-[#ff7518] focus:ring-2 focus:ring-orange-100`}
          />
          {errors.firstName && (
            <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
            Last Name <span style={{ color: '#ff7518' }}>*</span>
          </Label>
          <Input
            {...register('lastName')}
            placeholder="e.g. Wanjiku"
            className={`rounded-[8px] text-[13px] sm:text-[14px] border ${
              errors.lastName ? 'border-red-500' : 'border-[#e0e0e0]'
            } focus:border-[#ff7518] focus:ring-2 focus:ring-orange-100`}
          />
          {errors.lastName && (
            <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
          Patient Age Group <span style={{ color: '#ff7518' }}>*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ageGroups.map(({ value, label, sub }) => {
            const selected = ageGroup === value;
            return (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue('ageGroup', value as AgeGroup, { shouldValidate: true })}
                className={`flex-1 flex flex-col items-center justify-center py-2 sm:py-3 rounded-[8px] sm:rounded-[10px] border-2 transition-all duration-200 ${
                  selected ? 'ring-2 ring-[#ff7518]/20' : ''
                }`}
                style={{
                  borderColor: selected ? '#071e36' : '#e0e0e0',
                  background: selected ? '#071e36' : '#fff',
                }}
              >
                <span className="font-bold text-[12px] sm:text-[14px]" style={{ color: selected ? '#fff' : '#171717' }}>
                  {label}
                </span>
                <span className="text-[9px] sm:text-[11px]" style={{ color: selected ? 'rgba(255,255,255,0.65)' : '#62748e' }}>
                  {sub}
                </span>
              </motion.button>
            );
          })}
        </div>
        {errors.ageGroup && (
          <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.ageGroup.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
            Phone Number <span style={{ color: '#ff7518' }}>*</span>
          </Label>
          <Input
            {...register('phoneNumber')}
            type="tel"
            placeholder="+254 700 000 000"
            className={`rounded-[8px] text-[13px] sm:text-[14px] border ${
              errors.phoneNumber ? 'border-red-500' : 'border-[#e0e0e0]'
            } focus:border-[#ff7518] focus:ring-2 focus:ring-orange-100`}
          />
          {errors.phoneNumber && (
            <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
            Email Address
          </Label>
          <Input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            className={`rounded-[8px] text-[13px] sm:text-[14px] border ${
              errors.email ? 'border-red-500' : 'border-[#e0e0e0]'
            } focus:border-[#ff7518] focus:ring-2 focus:ring-orange-100`}
          />
          {errors.email && (
            <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
          Brief Description
        </Label>
        <Textarea
          {...register('briefDescription')}
          placeholder="Anything helpful about the patient's condition or history (optional)…"
          rows={3}
          className="rounded-[8px] text-[13px] sm:text-[14px] border border-[#e0e0e0] focus:border-[#ff7518] focus:ring-2 focus:ring-orange-100 resize-none"
        />
        {errors.briefDescription && (
          <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.briefDescription.message}</p>
        )}
      </div>

      {/* Footer with Back and Continue buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 mt-2 border-t border-[#f1f5f9]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full text-[12px] sm:text-[13px] font-semibold px-4 sm:px-6 py-2 sm:py-2.5 w-full sm:w-auto"
          style={{ borderColor: '#e0e0e0', color: '#62748e' }}
        >
          ← Back
        </Button>
        <Button
          type="submit"
          disabled={!isFormValid}
          className="rounded-full text-[12px] sm:text-[13px] font-black px-5 sm:px-7 py-2 sm:py-2.5 transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
          style={{
            background: isFormValid ? '#ff7518' : '#e0e0e0',
            color: isFormValid ? '#fff' : '#62748e',
            boxShadow: isFormValid ? '0 4px 18px rgba(255,117,24,0.30)' : 'none',
          }}
        >
          Continue →
        </Button>
      </div>
    </form>
  );
}