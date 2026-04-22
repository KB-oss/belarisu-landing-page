// app/booking/confirmation-step.tsx
'use client';

import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, User, Stethoscope, DollarSign, Phone, Mail, MessageCircle, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { createBooking } from '@/app/(public)/actions/booking';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConfirmationStepProps {
  onBack: () => void;
}

export function ConfirmationStep({ onBack }: ConfirmationStepProps) {
  const router = useRouter();
  const { data, resetBooking } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!data.confirmation.termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

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
        toast.success('Booking confirmed! Check your email for details');
        resetBooking();
        router.push('/booking/success');
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
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
      '0-12-months': '0-12 months',
      '1-3-years': '1-3 years',
      '4-12-years': '4-12 years',
      '13-17-years': '13-17 years',
      '18-plus': '18+ years',
    };
    return groups[ageGroup] || ageGroup;
  };

  const getContactMethodIcon = (method: string) => {
    switch(method) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Review Your Booking</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Section */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Service
          </h3>
          <p className="text-sm">{getServiceName(data.service!)}</p>
        </Card>

        {/* Doctor & Time Section */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Doctor & Time
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Doctor:</span>
              <span className="font-medium">
                Dr. {data.doctorSelection.doctor?.name}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Specialty:</span>
              <span>{data.doctorSelection.doctor?.specialty}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>
                {data.doctorSelection.selectedSlot?.date && 
                  format(data.doctorSelection.selectedSlot.date, 'EEEE, MMMM d, yyyy')}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{data.doctorSelection.selectedSlot?.time}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Fee:</span>
              <span>${data.doctorSelection.doctor?.consultation_fee}</span>
            </p>
          </div>
        </Card>

        {/* Patient Details Section */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Patient Details
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{data.patientDetails.firstName} {data.patientDetails.lastName}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Age Group:</span>
              <span>{getAgeGroupLabel(data.patientDetails.ageGroup!)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span>{data.patientDetails.phoneNumber}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="truncate max-w-[200px]">{data.patientDetails.email}</span>
            </p>
            {data.patientDetails.briefDescription && (
              <div className="mt-2">
                <p className="text-muted-foreground">Brief Description:</p>
                <p className="text-sm mt-1">{data.patientDetails.briefDescription}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Preferences Section */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            {getContactMethodIcon(data.contactPreferences.contactMethod!)}
            Contact Preferences
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Contact Method:</span>
              <span>{getContactMethodLabel(data.contactPreferences.contactMethod!)}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start gap-2 p-4 border rounded-lg bg-muted/10">
        <input
          type="checkbox"
          id="terms"
          checked={data.confirmation.termsAccepted}
          onChange={(e) => {
            const { updateConfirmation } = useBookingStore.getState();
            updateConfirmation({ termsAccepted: e.target.checked });
          }}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm">
          I confirm that the information provided is accurate and I agree to the{' '}
          <a href="/terms" className="text-primary hover:underline">
            terms and conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            privacy policy
          </a>
          .
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
}