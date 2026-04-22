// components/booking/ServiceStep.tsx
'use client';

import React from 'react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 'orthodontics-dental',
    title: 'Orthodontics & Dental',
    icon: '🦷',
    description: 'Jaw development & dental alignment',
  },
  {
    id: 'surgery',
    title: 'Surgery',
    icon: '🔬',
    description: 'Cleft lip & palate surgical repair',
  },
  {
    id: 'speech-therapy',
    title: 'Speech Therapy',
    icon: '🗣️',
    description: 'Communication & speech development',
  },
  {
    id: 'nutritional-support',
    title: 'Nutritional Support',
    icon: '🌿',
    description: 'Feeding guidance & growth monitoring',
  },
  {
    id: 'psychosocial-care',
    title: 'Psychosocial Care',
    icon: '🧠',
    description: 'Counseling for patients & families',
  },
  {
    id: 'ent-care',
    title: 'ENT Care',
    icon: '👂',
    description: 'Ear, nose & throat health',
  },
];

interface ServiceStepProps {
  onNext: () => void;
}

export function ServiceStep({ onNext }: ServiceStepProps) {
  const { data, updateService } = useBookingStore();
  const [selectedService, setSelectedService] = React.useState(data.service);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId as any);
  };

  const handleContinue = () => {
    if (selectedService) {
      updateService(selectedService);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left mb-8">
        <h2 className="text-sm font-bold mb-2 text-primary-orange relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[20px] before:h-[2px] before:bg-primary-orange">
          STEP 1 OF 4
        </h2>
        <h3 className="text-3xl font-bold mb-2 text-primary-dark ">Which <span className="text-primary-orange font-normal">service</span> do you need?</h3>
        <p className="text-muted-foreground text-sm">
          Select the service that best describes why you're visiting. Not sure? That's fine — just
          pick the closest one or choose below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${selectedService === service.id ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            onClick={() => handleServiceSelect(service.id)}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{service.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{service.title}</h4>
                  {selectedService === service.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {service.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mb-4"
        onClick={() => handleServiceSelect('general-assessment')}
      >
        Not sure — I need a general assessment
      </Button>

      <div className="flex justify-between items-center pt-4">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to site
        </Link>
        <Button onClick={handleContinue} disabled={!selectedService}>
          Continue →
        </Button>
      </div>
    </div>
  );
}