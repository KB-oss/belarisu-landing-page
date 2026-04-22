// components/booking/PatientDetailsStep.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PatientDetailsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ageGroups: { value: AgeGroup; label: string }[] = [
  { value: '0-12-months', label: '0–12 months' },
  { value: '1-3-years', label: '1–3 years' },
  { value: '4-12-years', label: '4–12 years' },
  { value: '13-17-years', label: '13–17 years' },
  { value: '18-plus', label: '18+ adult' },
];

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
  });

  const ageGroup = watch('ageGroup');

  const onSubmit = (formData: PatientDetailsFormData) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-left mb-8">
        <h2 className="text-sm font-bold mb-2 text-primary-orange relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[20px] before:h-[2px] before:bg-primary-orange">
          STEP 2 OF 4
        </h2>        
        <h3 className="text-4xl font-bold mb-2">Patient <span className='font-extralight text-primary-orange'>details</span></h3>
        <p className="text-muted-foreground">
          Tell us about the person who needs care. All fields marked * are required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Amara"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Wanjiku"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ageGroup">
          Patient Age Group <span className="text-red-500">*</span>
        </Label>
        <Select
          value={ageGroup}
          onValueChange={(value) =>
            setValue('ageGroup', (value ?? '0-12-months') as AgeGroup)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select age group" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((group) => (
              <SelectItem key={group.value} value={group.value}>
                {group.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ageGroup && (
          <p className="text-sm text-red-500">{errors.ageGroup.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            placeholder="+254 700 000 000"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            {...register('email')}
            type="email"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="briefDescription">Brief Description</Label>
        <Textarea
          id="briefDescription"
          {...register('briefDescription')}
          placeholder="Anything helpful about the patient's condition or history (optional)…"
          rows={4}
        />
        {errors.briefDescription && (
          <p className="text-sm text-red-500">{errors.briefDescription.message}</p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit">
          Continue →
        </Button>
      </div>
    </form>
  );
}