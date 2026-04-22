// app/booking/page.tsx
'use client';

import { useBookingStore } from '@/store/booking-store';
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperSeparator,
  StepperContent,
  StepperPanel,
} from '@/components/ui/stepper';
import { ServiceStep } from './steps/service-step';
import { PatientDetailsStep } from './steps/patient-details-step';
import { ConfirmationStep } from './steps/confirmation-step';
import { DoctorSelectionStep } from './steps/doctor-selection-step';
import {  CheckCircle, Clock, LockIcon } from 'lucide-react';

export default function BookingPage() {
  const { currentStep, setStep } = useBookingStore();

  const steps = [
    {
      number: 1,
      title: 'Service',
      description: 'Choose a service',
      content: {
        title: {
          prefix: 'What brings you to BMC?',
          highlight: null,
          suffix: null
        },
        subtitle: 'Choose the type of medical service you need',
        image: '/images/service-illustration.svg',
        details: 'We offer six specialised services as part of our Comprehensive Cleft Care model. Every service is free and coordinated under one roof.'
      }
    },
    {
      number: 2,
      title: 'Patient',
      description: 'Tell us about the patient',
      content: {
        title: {
          prefix: 'Tell us about the patient',
          highlight: null,
          suffix: null
        },
        subtitle: 'Provide patient details',
        image: '/images/patient-details-illustration.svg',
        details: 'Your details help our care team prepare for your visit and assign the right specialist to your case before you even arrive.'
      }
    },
    {
      number: 3,
      title: 'Doctor',
      description: 'Select doctor and time',
      content: {
        title: {
          prefix: 'Choose Your Doctor & Time',
          highlight: null,
          suffix: null
        },
        subtitle: 'Select preferred doctor and schedule',
        image: '/images/doctor-time-illustration.svg',
        details: 'Our patient support team will confirm your appointment within 24 hours. Tell us your preferred way to connect.'
      }
    },
    {
      number: 4,
      title: 'Confirmation',
      description: 'Review your details',
      content: {
        title: {
          prefix: 'Almost there — ',
          highlight: 'review',
          suffix: ' your details'
        },
        subtitle: 'Verify your appointment details',
        image: '/images/confirmation-illustration.svg',
        details: 'Check everything looks right before we submit. Our staff will contact you within 24 hours to confirm your appointment.'
      }
    },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const currentStepContent = steps.find(step => step.number === currentStep)?.content;

  return (
    <div className="min-h-[80vh] p-10 ">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        {/* Left Side - Blue Background */}
        <div className="w-full bg-primary-dark text-white rounded-2xl relative">
          <div className="p-8">
            {/* Stepper Navigation - Horizontal */}
            <div className="mb-12 mx-20">
              <Stepper
                defaultValue={1}
                value={currentStep}
                onValueChange={setStep}
                orientation="horizontal"
                
              >
                <div className="w-full flex items-center justify-center">
                  {steps.map((step, idx) => (
                    <StepperItem
                      key={step.number}
                      step={step.number}
                      completed={step.number < currentStep}
                      className="flex-1"
                    >
                      <div>
                        <StepperIndicator className="w-10 h-10 rounded-full bg-primary-orange/10 border-2 border-primary-orange text-white font-semibold flex items-center justify-center">
                          {step.number}
                        </StepperIndicator>
                        <div className="flex flex-col items-center mt-1">
                          <div className="text-xs font-semibold">
                            {step.title}
                          </div>
                        </div>
                      </div>
                      {idx < steps.length - 1 && (
                        <StepperSeparator className="flex items-center gap-2 justify-center mx-2 h-px " />
                      )}
                    </StepperItem>
                  ))}
                </div>
              </Stepper>
            </div>

            {/* Content based on current step */}
            <div className="mt-8 pt-8 border-t border-white/20 ">
              <div className="space-y-4">
                <h2 className="text-sm font-bold mb-2 text-primary-orange relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[20px] before:h-[2px] before:bg-primary-orange">
                  STEP {currentStep} OF 4
                </h2>

                <h3 className="text-4xl font-bold mb-2">
                  {currentStepContent?.title.highlight ? (
                    <>
                      {currentStepContent.title.prefix}
                      <span className="text-primary-orange font-extralight">
                        {currentStepContent.title.highlight}
                      </span>
                      {currentStepContent.title.suffix}
                    </>
                  ) : (
                    currentStepContent?.title.prefix
                  )}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {currentStepContent?.details}
                </p>
              </div>

              <div className='absolute bottom-20 left-6 space-y-4'>
                <p className='flex items-center gap-2 text-sm'>
                  <CheckCircle className='text-green-400 size-4 mr-2' />
                  Free comprehensive care for all patients
                </p>
                <p className='flex items-center gap-2 text-sm'>
                  <Clock className='text-gray-300 size-4 mr-2' />
                  Response within 24 hours
                </p>
                <p className='flex items-center gap-2 text-sm'>
                  <LockIcon className='text-yellow-500 size-4 mr-2' />
                  Your information is private and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-8 md:p-12 max-w-4xl mx-auto">
            <Stepper defaultValue={1} value={currentStep} onValueChange={setStep}>
              <StepperPanel>
                <StepperContent value={1}>
                  <ServiceStep onNext={handleNext} />
                </StepperContent>

                <StepperContent value={2}>
                  <PatientDetailsStep onNext={handleNext} onBack={handleBack} />
                </StepperContent>

                <StepperContent value={3}>
                  <DoctorSelectionStep onNext={handleNext} onBack={handleBack} />
                </StepperContent>

                <StepperContent value={4}>
                  <ConfirmationStep onBack={handleBack} />
                </StepperContent>
              </StepperPanel>
            </Stepper>
          </div>
        </div>
      </div>
    </div>
  );
}