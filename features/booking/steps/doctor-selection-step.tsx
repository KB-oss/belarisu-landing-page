// app/booking/doctor-selection-step.tsx
'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { getDoctors, getAvailableSlots } from '@/app/(public)/actions/booking';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, DollarSign, Briefcase, CalendarIcon, User, Stethoscope, Phone, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface DoctorSelectionStepProps {
  onNext: () => void;
  onBack: () => void;
}


const contactMethods = [
  { id: 'phone', title: 'Phone Call', icon: '📞', description: 'We will call you to confirm' },
  { id: 'email', title: 'Email', icon: '✉️', description: 'Receive confirmation via email' },
  { id: 'whatsapp', title: 'WhatsApp', icon: '💬', description: 'Get updates on WhatsApp' },
  { id: 'walk-in', title: 'Walk-in', icon: '🚶', description: 'Just come to the clinic' },
];

const days = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export function DoctorSelectionStep({ onNext, onBack }: DoctorSelectionStepProps) {
  const { data, updateDoctorSelection, updatePatientDetails, updateContactPreferences } = useBookingStore();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    data.doctorSelection.doctorId || null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.doctorSelection.selectedSlot?.date || undefined
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    data.doctorSelection.selectedSlot?.time || ''
  );

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const doctorsData = await getDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDoctorId || !selectedDate) return;

    setIsLoading(true);
    try {
      const slots = await getAvailableSlots(selectedDoctorId, selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load available slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctorId(doctorId);
    updateDoctorSelection({ doctorId, doctor: doctor || null });
    setSelectedSlot('');
    setSelectedDate(undefined);
    updateDoctorSelection({ selectedSlot: null });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot('');
    if (date) {
      updateDoctorSelection({ selectedSlot: null });
    }
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot.time);
    updateDoctorSelection({
      selectedSlot: {
        date: selectedDate!,
        time: slot.time,
        doctorId: selectedDoctorId!
      }
    });
  };

  const handleNext = () => {
    // Validate all fields
    if (!selectedDoctorId) {
      toast.error('Please select a doctor');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!data.patientDetails.firstName) {
      toast.error('Please enter first name');
      return;
    }

    if (!data.patientDetails.lastName) {
      toast.error('Please enter last name');
      return;
    }

    if (!data.patientDetails.ageGroup) {
      toast.error('Please select age group');
      return;
    }

    if (!data.patientDetails.phoneNumber) {
      toast.error('Please enter phone number');
      return;
    }

    if (!data.patientDetails.email) {
      toast.error('Please enter email');
      return;
    }

    if (!data.contactPreferences.contactMethod) {
      toast.error('Please select a contact method');
      return;
    }

    onNext();
  };

  const getDayName = (date: Date) => {
    return format(date, 'EEEE');
  };
  console.log(availableSlots);


  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  return (
    <div className="space-y-8">
      {/* Doctor Selection */}
      <div>
        <div className="text-left mb-8">
          <h2 className="text-sm font-bold mb-2 text-primary-orange relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[20px] before:h-[2px] before:bg-primary-orange">
            STEP 3 OF 4
          </h2>
          <h3 className="text-4xl font-bold mb-2">Select <span className='font-extralight text-primary-orange'>Doctor</span></h3>
          <p className="text-muted-foreground">
            Choose your preferred doctor from our team of specialists        </p>
        </div>

        {isLoading && doctors.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <RadioGroup value={selectedDoctorId || ''} onValueChange={handleDoctorSelect}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedDoctorId === doctor.id ? 'ring-2 ring-primary' : ''
                    }`}
                  onClick={() => handleDoctorSelect(doctor.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={doctor.id} id={doctor.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={doctor.id} className="font-semibold text-base cursor-pointer">
                          Dr. {doctor.name}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Stethoscope className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-3 text-sm">
                          {doctor.years_of_experience > 0 && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              <span>{doctor.years_of_experience}+ years</span>
                            </div>
                          )}
                          {doctor.consultation_fee > 0 && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${doctor.consultation_fee}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(`2000-01-01 ${doctor.work_start_time}`), 'h:mm a')} -
                              {format(new Date(`2000-01-01 ${doctor.work_end_time}`), 'h:mm a')}
                            </span>
                          </div>
                        </div>

                        {doctor.bio && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {doctor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Date Selection */}
      {selectedDoctorId && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Select Date</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Choose a date for your appointment
          </p>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              return date < new Date()
            }}
            className="rounded-md border w-full"
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground"
            }}
          />
        </div>
      )}

      {/* Time Slots */}
      {/* Time Slots */}
      {selectedDoctorId && selectedDate && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Select Time</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {getDayName(selectedDate)}, {format(selectedDate, 'MMMM d, yyyy')}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  type="button"
                  variant={selectedSlot === slot.time ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
              <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No available slots for this date
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                All slots are booked. Please select another date.
              </p>
            </div>
          )}
        </div>
      )}



      {/* Contact Methods */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Contact Method</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          How would you like us to contact you?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactMethods.map((method) => (
            <Card
              key={method.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${data.contactPreferences.contactMethod === method.id ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
              onClick={() => updateContactPreferences({ contactMethod: method.id as any })}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{method.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{method.title}</h4>
                    {data.contactPreferences.contactMethod === method.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>



      {/* Selected Appointment Summary */}
      {selectedDoctor && selectedSlot && selectedDate && (
        <div className="bg-muted/20 rounded-lg p-4 border">
          <h3 className="font-semibold mb-2">Selected Appointment Summary</h3>
          <div className="space-y-1 text-sm">
            <p>👨‍⚕️ Dr. {selectedDoctor.name} - {selectedDoctor.specialty}</p>
            <p>📅 {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            <p>⏰ {selectedSlot}</p>
            <p>👤 {data.patientDetails.firstName} {data.patientDetails.lastName}</p>
            <p>📞 {data.contactPreferences.contactMethod === 'phone' ? 'Phone call' :
              data.contactPreferences.contactMethod === 'email' ? 'Email' :
                data.contactPreferences.contactMethod === 'whatsapp' ? 'WhatsApp' : 'Walk-in'}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue to Confirmation
        </Button>
      </div>
    </div>
  );
}