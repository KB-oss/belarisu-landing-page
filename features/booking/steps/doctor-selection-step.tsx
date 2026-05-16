// components/booking/DoctorSelectionStep.tsx
'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { getDoctors, getAvailableSlots } from '@/app/actions/booking';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Clock, Stethoscope, Briefcase, Phone, CheckCircle2, CalendarIcon, CheckCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export function DoctorSelectionStep({ onNext, onBack }: DoctorSelectionStepProps) {
  const { data, updateDoctorSelection, updateContactPreferences } = useBookingStore();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.doctorSelection.selectedSlot?.date || undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    data.doctorSelection.selectedSlot?.time || ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (data.doctorSelection.doctorId && selectedDate) {
      loadAvailableSlots();
    }
  }, [data.doctorSelection.doctorId, selectedDate]);

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
    if (!data.doctorSelection.doctorId || !selectedDate) return;
    setIsLoading(true);
    try {
      const slots = await getAvailableSlots(data.doctorSelection.doctorId, selectedDate);
      setAvailableSlots(slots);
      setSelectedTime('');
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load available slots');
    } finally {
      setIsLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.doctorSelection.doctorId) newErrors.doctor = 'Please select a doctor';
    if (!selectedDate) newErrors.date = 'Please select a date';
    if (!selectedTime) newErrors.time = 'Please select a time slot';
    if (!data.contactPreferences.contactMethod) newErrors.contact = 'Please select a contact method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateDoctorSelection({
        selectedSlot: {
          day: selectedDate ? format(selectedDate, 'EEEE') : '',
          time: selectedTime,
          date: selectedDate!,
          doctorId: data.doctorSelection.doctorId!
        }
      });
      onNext();
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    updateDoctorSelection({ doctorId, doctor: doctor || null });
    setSelectedDate(undefined);
    setSelectedTime('');
    setAvailableSlots([]);
    updateDoctorSelection({ selectedSlot: null });
    setErrors(prev => ({ ...prev, doctor: '' }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
    setCalendarOpen(false);
    setErrors(prev => ({ ...prev, date: '', time: '' }));
  };

  const handleSlotSelect = (slotTime: string) => {
    setSelectedTime(slotTime);
    setErrors(prev => ({ ...prev, time: '' }));
  };

  const selectedDoctor = doctors.find(d => d.id === data.doctorSelection.doctorId);

  // Check if all required fields are filled
  const isFormValid = !!data.doctorSelection.doctorId && !!selectedDate && 
                      !!selectedTime && !!data.contactPreferences.contactMethod;

  // Disable past dates
  const disablePastDates = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 sm:px-0">
      <div>
        <p className="text-[10px] sm:text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>
          Step 3 of 4
        </p>
        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2 leading-tight" style={{ fontSize: 'clamp(1.2rem, 5vw, 1.75rem)' }}>
          Choose Your <span style={{ color: '#ff7518' }}>Doctor</span> & Time
        </h2>
        <p className="text-[12px] sm:text-[14px] leading-[1.6] sm:leading-[1.7]" style={{ color: '#62748e' }}>
          Select your preferred doctor from our team of specialists
        </p>
        {errors.doctor && <p className="text-[11px] sm:text-[12px] mt-2" style={{ color: '#ef4444' }}>{errors.doctor}</p>}
      </div>

      {/* Doctor Selection */}
      <div>
        {isLoading && doctors.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 sm:h-28 w-full rounded-[12px] sm:rounded-[14px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {doctors.map((doctor, index) => {
              const selected = data.doctorSelection.doctorId === doctor.id;
              return (
                <motion.button
                  key={doctor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleDoctorSelect(doctor.id)}
                  className={`text-left p-2.5 sm:p-3 rounded-[12px] sm:rounded-[14px] border-2 transition-all duration-200 relative cursor-pointer ${
                    selected ? 'ring-2 ring-[#ff7518]/20' : ''
                  }`}
                  style={{
                    borderColor: selected ? '#ff7518' : '#e0e0e0',
                    background: selected ? 'rgba(7,30,54,0.04)' : '#fff',
                  }}
                >
                  {selected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center" style={{ background: '#ff7518' }}>
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] sm:rounded-[10px] flex items-center justify-center shrink-0"
                      style={{
                        background: selected ? 'rgba(7,30,54,0.08)' : '#f1f5f9',
                        color: selected ? '#071e36' : '#62748e',
                      }}
                    >
                      <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[12px] sm:text-[13px] mb-0.5" style={{ color: selected ? '#071e36' : '#171717' }}>
                        Dr. {doctor.name}
                      </p>
                      <p className="text-[10px] sm:text-[11px] mb-1 sm:mb-1.5 truncate" style={{ color: '#62748e' }}>{doctor.specialty}</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[10px]" style={{ color: '#62748e' }}>
                        {doctor.years_of_experience > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Briefcase className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                            <span>{doctor.years_of_experience}+ yrs</span>
                          </div>
                        )}
                        <div className="flex items-center gap-0.5">
                          <Clock className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                          <span>
                            {format(new Date(`2000-01-01 ${doctor.work_start_time}`), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Date Selection - Calendar Popover */}
      {data.doctorSelection.doctorId && (
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[12px] sm:text-[13px]" style={{ color: '#26364c' }}>
            Select Date <span style={{ color: '#ff7518' }}>*</span>
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-[8px] border px-3 py-2 text-[12px] sm:text-[13px] h-auto",
                  !selectedDate && "text-muted-foreground",
                  errors.date && "border-red-500"
                )}
                style={{ borderColor: errors.date ? '#ef4444' : '#e0e0e0' }}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" style={{ color: '#ff7518' }} />
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : <span style={{ color: '#ff7518' }}>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disablePastDates}
                initialFocus
                className="rounded-md border "
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-[10px] sm:text-[11px]" style={{ color: '#ef4444' }}>{errors.date}</p>}
        </div>
      )}

      {/* Time Slots */}
      {data.doctorSelection.doctorId && selectedDate && (
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: '#ff7518' }} />
            <h3 className="font-bold text-[12px] sm:text-[13px]" style={{ color: '#071e36' }}>Select Time</h3>
          </div>
          <p className="text-[11px] sm:text-[12px] mb-2 sm:mb-3" style={{ color: '#62748e' }}>
            Available time slots for {format(selectedDate, 'EEEE, MMMM d')}
          </p>
          {errors.time && <p className="text-[11px] sm:text-[12px] mb-2" style={{ color: '#ef4444' }}>{errors.time}</p>}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-8 sm:h-9 w-full rounded-[8px]" />
              ))}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  type="button"
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className="w-full rounded-[8px] text-[11px] sm:text-[12px] font-semibold transition-all duration-200 h-8 sm:h-9"
                  style={{
                    background: selectedTime === slot.time ? '#ff7518' : '#fff',
                    borderColor: selectedTime === slot.time ? '#ff7518' : '#e0e0e0',
                    color: selectedTime === slot.time ? '#fff' : '#62748e',
                  }}
                  onClick={() => handleSlotSelect(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 border rounded-lg" style={{ borderColor: '#e0e0e0', background: '#f8fafc' }}>
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1.5 sm:mb-2" style={{ color: '#62748e' }} />
              <p className="text-[11px] sm:text-[12px]" style={{ color: '#62748e' }}>No available slots for this date</p>
              <p className="text-[10px] sm:text-[11px] mt-1" style={{ color: '#62748e' }}>Please select another date.</p>
            </div>
          )}
        </div>
      )}

      {/* Contact Methods */}
      <div>
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: '#ff7518' }} />
          <h3 className="font-bold text-[12px] sm:text-[13px]" style={{ color: '#071e36' }}>Contact Method</h3>
        </div>
        <p className="text-[11px] sm:text-[12px] mb-2 sm:mb-3" style={{ color: '#62748e' }}>
          How would you like us to contact you?
        </p>
        {errors.contact && <p className="text-[11px] sm:text-[12px] mb-2" style={{ color: '#ef4444' }}>{errors.contact}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {contactMethods.map((method) => {
            const selected = data.contactPreferences.contactMethod === method.id;
            return (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  updateContactPreferences({ contactMethod: method.id as any });
                  setErrors(prev => ({ ...prev, contact: '' }));
                }}
                className={`text-left p-2.5 sm:p-3 rounded-[10px] sm:rounded-[12px] border-2 transition-all duration-200 relative cursor-pointer ${
                  selected ? 'ring-2 ring-[#ff7518]/20' : ''
                }`}
                style={{
                  borderColor: selected ? '#ff7518' : '#e0e0e0',
                  background: selected ? 'rgba(7,30,54,0.04)' : '#fff',
                }}
              >
                {selected && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center" style={{ background: '#ff7518' }}>
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-lg sm:text-xl">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[11px] sm:text-[12px] mb-0.5" style={{ color: selected ? '#071e36' : '#171717' }}>
                      {method.title}
                    </p>
                    <p className="text-[9px] sm:text-[10px]" style={{ color: '#62748e' }}>
                      {method.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer with Back and Continue buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 mt-1 border-t border-[#f1f5f9]">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full text-[11px] sm:text-[12px] font-semibold px-4 sm:px-5 py-1.5 sm:py-2 w-full sm:w-auto"
          style={{ borderColor: '#e0e0e0', color: '#62748e' }}
        >
          ← Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className="rounded-full text-[11px] sm:text-[12px] font-black px-5 sm:px-6 py-1.5 sm:py-2 transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
          style={{
            background: isFormValid ? '#ff7518' : '#e0e0e0',
            color: isFormValid ? '#fff' : '#62748e',
            boxShadow: isFormValid ? '0 4px 18px rgba(255,117,24,0.30)' : 'none',
          }}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}