// app/actions/booking.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { format, addMinutes, parse, } from 'date-fns';

// Types
interface Doctor {
    id: string;
    name: string;
    email: string;
    specialty: string;
    work_start_time: string;
    work_end_time: string;
    slot_duration: number;
    working_days: Record<string, boolean>;
}

type ProfileRecord = {
    first_name: string;
    last_name: string;
    email: string;
};

type DoctorRowWithProfile = Omit<Doctor, 'name' | 'email'> & {
    // Supabase can return either an object or an array for relationships.
    profile: ProfileRecord | ProfileRecord[] | null;
};



export async function getDoctors() {
    const supabase = await createClient();

    // First get doctors
    const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select(`
      id,
      user_id,
      specialty,
      bio,
      consultation_fee,
      years_of_experience,
      is_active,
      work_start_time,
      work_end_time,
      slot_duration,
      working_days
    `)
        .eq('is_active', true)
        .order('years_of_experience', { ascending: false });

    if (doctorsError) {
        console.error('Error fetching doctors:', doctorsError);
        throw new Error(doctorsError.message);
    }

    if (!doctors || doctors.length === 0) {
        return [];
    }

    // Get all user IDs from doctors
    const userIds = doctors.map(doctor => doctor.user_id);

    // Fetch profiles for these users
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw new Error(profilesError.message);
    }

    // Create a map for quick profile lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
    });

    // Combine the data
    return doctors.map(doctor => {
        const profile = profileMap.get(doctor.user_id);

        return {
            id: doctor.id,
            user_id: doctor.user_id,
            name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown',
            email: profile?.email ?? '',
            specialty: doctor.specialty,
            bio: doctor.bio,
            consultation_fee: doctor.consultation_fee,
            years_of_experience: doctor.years_of_experience,
            work_start_time: doctor.work_start_time,
            work_end_time: doctor.work_end_time,
            slot_duration: doctor.slot_duration,
            is_active: doctor.is_active
        };
    });
}

// Helper function to check if doctor works on a specific day
function isWorkingDay(workingDays: Record<string, boolean>, date: Date): boolean {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[date.getDay()];
    return workingDays[dayName] || false;
}

// Get available time slots for a doctor on a specific date
export async function getAvailableSlots(doctorId: string, date: Date) {
    const supabase = await createClient();

    // Get doctor's working hours
    const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('work_start_time, work_end_time, slot_duration, working_days')
        .eq('id', doctorId)
        .single();

    if (doctorError || !doctor) {
        throw new Error('Doctor not found');
    }

    // Check if doctor works on this day
    if (!isWorkingDay(doctor.working_days, date)) {
        return [];
    }

    // Get already booked slots for this date
    const { data: bookedSlots, error: bookedError } = await supabase
        .from('booked_slots')
        .select('slot_time')
        .eq('doctor_id', doctorId)
        .eq('slot_date', format(date, 'yyyy-MM-dd'))
        .eq('status', 'booked');

    if (bookedError) throw new Error(bookedError.message);

    // Normalize booked times to the same format as generated slots
    const bookedTimes = new Set(
        bookedSlots?.map(slot => {
            // If stored as '09:00:00', convert to '09:00 AM'
            if (slot.slot_time.includes(':')) {
                const [hours, minutes] = slot.slot_time.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 || 12;
                return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
            }
            return slot.slot_time;
        }) || []
    );

    // Generate all possible time slots
    const slots = [];
    const startTime = parse(doctor.work_start_time, 'HH:mm:ss', new Date());
    const endTime = parse(doctor.work_end_time, 'HH:mm:ss', new Date());
    const duration = doctor.slot_duration;

    let currentTime = startTime;

    while (currentTime < endTime) {
        const timeString = format(currentTime, 'hh:mm a');

        if (!bookedTimes.has(timeString)) {
            slots.push({
                date: date,
                time: timeString,
                isAvailable: true,
                doctorId: doctorId
            });
        }

        currentTime = addMinutes(currentTime, duration);
    }

    return slots;
}

// Create a booking (same as before)
export async function createBooking(data: any) {
    const supabase = await createClient();

    // const { data: { user } } = await supabase.auth.getUser();

    // if (!user) {
    //     throw new Error('You must be logged in to book');
    // }

    // Generate unique booking number
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            booking_number: bookingNumber,
            doctor_id: data.selectedDoctor,
            service_type: data.service,
            patient_first_name: data.patientDetails.firstName,
            patient_last_name: data.patientDetails.lastName,
            patient_age_group: data.patientDetails.ageGroup,
            patient_phone: data.patientDetails.phoneNumber,
            patient_email: data.patientDetails.email,
            patient_address: data.patientDetails.address,
            patient_notes: data.patientDetails.notes,
            contact_method: data.contactPreferences.contactMethod,
            status: 'pending',
            // created_by: user.id
        })
        .select()
        .single();

    if (bookingError) {
        throw new Error(bookingError.message);
    }

    // Create booked slot
    if ( data.selectedSlot) {
        const { error: slotError } = await supabase
            .from('booked_slots')
            .insert({
                booking_id: booking.id,
                doctor_id: data.selectedDoctor,
                slot_date: format(data.selectedSlot.date, 'yyyy-MM-dd'),
                slot_time: data.selectedSlot.time,
                status: 'booked'
            });

        if (slotError) {
            // Rollback - delete the booking
            await supabase.from('bookings').delete().eq('id', booking.id);
            throw new Error(slotError.message);
        }
    }

    return { success: true, booking };
}