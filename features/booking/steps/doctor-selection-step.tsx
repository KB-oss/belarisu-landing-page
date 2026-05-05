// components/booking/DoctorSelectionStep.tsx
'use client';

import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { getDoctors, getAvailableSlots } from '@/app/actions/booking';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Stethoscope, Briefcase, Phone, CheckCircle2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export function DoctorSelectionStep({ onNext, onBack }: DoctorSelectionStepProps) {
  const { data, updateDoctorSelection, updateContactPreferences } = useBookingStore();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(
    data.doctorSelection.selectedSlot?.day || ''
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    data.doctorSelection.selectedSlot?.time || ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (data.doctorSelection.doctorId && selectedDay) {
      loadAvailableSlots();
    }
  }, [data.doctorSelection.doctorId, selectedDay]);

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
    if (!data.doctorSelection.doctorId || !selectedDay) return;
    setIsLoading(true);
    try {
      // Create a date object from the selected day (using next occurrence of that day)
      const today = new Date();
      const dayIndex = DAYS.indexOf(selectedDay);
      const currentDayIndex = today.getDay();
      let daysToAdd = dayIndex - (currentDayIndex === 0 ? 7 : currentDayIndex);
      if (daysToAdd <= 0) daysToAdd += 7;
      const selectedDate = new Date(today);
      selectedDate.setDate(today.getDate() + daysToAdd);
      
      const slots = await getAvailableSlots(data.doctorSelection.doctorId, selectedDate);
      setAvailableSlots(slots);
      // Reset selected time when new slots load
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
    if (!selectedDay) newErrors.day = 'Please select a day';
    if (!selectedTime) newErrors.time = 'Please select a time slot';
    if (!data.contactPreferences.contactMethod) newErrors.contact = 'Please select a contact method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      // Create a date object from the selected day
      const today = new Date();
      const dayIndex = DAYS.indexOf(selectedDay);
      const currentDayIndex = today.getDay();
      let daysToAdd = dayIndex - (currentDayIndex === 0 ? 7 : currentDayIndex);
      if (daysToAdd <= 0) daysToAdd += 7;
      const selectedDate = new Date(today);
      selectedDate.setDate(today.getDate() + daysToAdd);
      
      updateDoctorSelection({
        selectedSlot: {
          day: selectedDay,
          time: selectedTime,
          date: selectedDate,
          doctorId: data.doctorSelection.doctorId!
        }
      });
      onNext();
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    updateDoctorSelection({ doctorId, doctor: doctor || null });
    setSelectedDay('');
    setSelectedTime('');
    setAvailableSlots([]);
    updateDoctorSelection({ selectedSlot: null });
    setErrors(prev => ({ ...prev, doctor: '' }));
  };

  const handleSlotSelect = (slotTime: string) => {
    setSelectedTime(slotTime);
    setErrors(prev => ({ ...prev, time: '' }));
  };

  const selectedDoctor = doctors.find(d => d.id === data.doctorSelection.doctorId);
  
  // Check if all required fields are filled
  const isFormValid = !!data.doctorSelection.doctorId && !!selectedDay && 
                      !!selectedTime && !!data.contactPreferences.contactMethod;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[12px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color: '#ff7518' }}>
          Step 3 of 4
        </p>
        <h2 className="font-black text-[#071e36] tracking-[-0.02em] mb-2" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)' }}>
          Choose Your <span style={{ color: '#ff7518' }}>Doctor</span> & Time
        </h2>
        <p className="text-[14px] leading-[1.7]" style={{ color: '#62748e' }}>
          Select your preferred doctor from our team of specialists
        </p>
        {errors.doctor && <p className="text-[12px] mt-2" style={{ color: '#ef4444' }}>{errors.doctor}</p>}
      </div>

      {/* Doctor Selection */}
      <div>
        {isLoading && doctors.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[14px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {doctors.map((doctor, index) => {
              const selected = data.doctorSelection.doctorId === doctor.id;
              return (
                <motion.button
                  key={doctor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleDoctorSelect(doctor.id)}
                  className={`text-left p-3 rounded-[14px] border-2 transition-all duration-200 relative cursor-pointer ${
                    selected ? 'ring-2 ring-[#ff7518]/20' : ''
                  }`}
                  style={{
                    borderColor: selected ? '#071e36' : '#e0e0e0',
                    background: selected ? 'rgba(7,30,54,0.04)' : '#fff',
                  }}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#071e36' }}>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{
                        background: selected ? 'rgba(7,30,54,0.08)' : '#f1f5f9',
                        color: selected ? '#071e36' : '#62748e',
                      }}
                    >
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[13px] mb-0.5" style={{ color: selected ? '#071e36' : '#171717' }}>
                        Dr. {doctor.name}
                      </p>
                      <p className="text-[11px] mb-1.5 truncate" style={{ color: '#62748e' }}>{doctor.specialty}</p>
                      <div className="flex flex-wrap gap-2 text-[10px]" style={{ color: '#62748e' }}>
                        {doctor.years_of_experience > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Briefcase className="h-2.5 w-2.5" />
                            <span>{doctor.years_of_experience}+ yrs</span>
                          </div>
                        )}
                        <div className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
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

      {/* Day Selection - Dropdown */}
      {data.doctorSelection.doctorId && (
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-[13px]" style={{ color: '#26364c' }}>
            Preferred Day <span style={{ color: '#ff7518' }}>*</span>
          </label>
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setSelectedTime('');
                setErrors(prev => ({ ...prev, day: '', time: '' }));
              }}
              className="w-full rounded-[8px] border px-3 py-2.5 text-[13px] appearance-none bg-white"
              style={{ borderColor: errors.day ? '#ef4444' : '#e0e0e0' }}
            >
              <option value="">Select a day</option>
              {DAYS.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#62748e' }} />
          </div>
          {errors.day && <p className="text-[11px]" style={{ color: '#ef4444' }}>{errors.day}</p>}
        </div>
      )}

      {/* Time Slots - Buttons (like original) */}
      {data.doctorSelection.doctorId && selectedDay && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" style={{ color: '#ff7518' }} />
            <h3 className="font-bold text-[13px]" style={{ color: '#071e36' }}>Select Time</h3>
          </div>
          <p className="text-[12px] mb-3" style={{ color: '#62748e' }}>
            Available time slots for {selectedDay}
          </p>
          {errors.time && <p className="text-[12px] mb-2" style={{ color: '#ef4444' }}>{errors.time}</p>}

          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-[8px]" />
              ))}
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  type="button"
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className="w-full rounded-[8px] text-[12px] font-semibold transition-all duration-200 h-9"
                  style={{
                    background: selectedTime === slot.time ? '#071e36' : '#fff',
                    borderColor: selectedTime === slot.time ? '#071e36' : '#e0e0e0',
                    color: selectedTime === slot.time ? '#fff' : '#62748e',
                  }}
                  onClick={() => handleSlotSelect(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border rounded-lg" style={{ borderColor: '#e0e0e0', background: '#f8fafc' }}>
              <Clock className="h-6 w-6 mx-auto mb-2" style={{ color: '#62748e' }} />
              <p className="text-[12px]" style={{ color: '#62748e' }}>No available slots for this day</p>
              <p className="text-[11px] mt-1" style={{ color: '#62748e' }}>Please select another day.</p>
            </div>
          )}
        </div>
      )}

      {/* Contact Methods */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Phone className="h-4 w-4" style={{ color: '#ff7518' }} />
          <h3 className="font-bold text-[13px]" style={{ color: '#071e36' }}>Contact Method</h3>
        </div>
        <p className="text-[12px] mb-3" style={{ color: '#62748e' }}>
          How would you like us to contact you?
        </p>
        {errors.contact && <p className="text-[12px] mb-2" style={{ color: '#ef4444' }}>{errors.contact}</p>}

        <div className="grid grid-cols-2 gap-2">
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
                className={`text-left p-3 rounded-[12px] border-2 transition-all duration-200 relative cursor-pointer ${
                  selected ? 'ring-2 ring-[#ff7518]/20' : ''
                }`}
                style={{
                  borderColor: selected ? '#071e36' : '#e0e0e0',
                  background: selected ? 'rgba(7,30,54,0.04)' : '#fff',
                }}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#071e36' }}>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-xl">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[12px] mb-0.5" style={{ color: selected ? '#071e36' : '#171717' }}>
                      {method.title}
                    </p>
                    <p className="text-[10px]" style={{ color: '#62748e' }}>
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
      <div className="flex justify-between items-center pt-3 mt-1" style={{ borderTop: '1px solid #f1f5f9' }}>
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full text-[12px] font-semibold px-5 py-2"
          style={{ borderColor: '#e0e0e0', color: '#62748e' }}
        >
          ← Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className="rounded-full text-[12px] font-black px-6 py-2 transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
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