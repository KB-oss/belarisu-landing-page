// store/booking-store.ts
import { create } from 'zustand';

export type ServiceType = 
  | 'orthodontics-dental'
  | 'surgery'
  | 'speech-therapy'
  | 'nutritional-support'
  | 'psychosocial-care'
  | 'ent-care'
  | 'general-assessment';

export type AgeGroup = '0-12-months' | '1-3-years' | '4-12-years' | '13-17-years' | '18-plus';

export type ContactMethod = 'phone' | 'email' | 'whatsapp' | 'walk-in';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  consultation_fee: number;
  years_of_experience: number;
  work_start_time: string;
  work_end_time: string;
  slot_duration: number;
  bio?: string;
  avatar_url?: string;
}

export interface SelectedSlot {
  date: Date;
  time: string;
  doctorId: string;
}

export interface BookingData {
  // Step 1: Service
  service: ServiceType | null;
  
  // Step 2: Doctor & Time Selection
  doctorSelection: {
    doctorId: string | null;
    doctor: Doctor | null;
    selectedSlot: SelectedSlot | null;
  };
  
  // Patient Details (moved from separate step)
  patientDetails: {
    firstName: string;
    lastName: string;
    ageGroup: AgeGroup | null;
    phoneNumber: string;
    email: string;
    briefDescription: string;
  };
  
  // Contact Preferences (moved from separate step)
  contactPreferences: {
    contactMethod: ContactMethod | null;
    preferredDay: string | null;
    preferredTimeSlot: string | null;
    isFlexible: boolean;
  };
  
  // Step 3: Confirmation
  confirmation: {
    termsAccepted: boolean;
  };
}

interface BookingStore {
  data: BookingData;
  currentStep: number;
  setStep: (step: number) => void;
  updateService: (service: ServiceType) => void;
  updateDoctorSelection: (selection: Partial<BookingData['doctorSelection']>) => void;
  updatePatientDetails: (details: Partial<BookingData['patientDetails']>) => void;
  updateContactPreferences: (preferences: Partial<BookingData['contactPreferences']>) => void;
  updateConfirmation: (confirmation: Partial<BookingData['confirmation']>) => void;
  resetBooking: () => void;
}

const initialData: BookingData = {
  service: null,
  doctorSelection: {
    doctorId: null,
    doctor: null,
    selectedSlot: null,
  },
  patientDetails: {
    firstName: '',
    lastName: '',
    ageGroup: null,
    phoneNumber: '',
    email: '',
    briefDescription: '',
  },
  contactPreferences: {
    contactMethod: null,
    preferredDay: null,
    preferredTimeSlot: null,
    isFlexible: true,
  },
  confirmation: {
    termsAccepted: false,
  },
};

export const useBookingStore = create<BookingStore>((set) => ({
  data: initialData,
  currentStep: 1,
  
  setStep: (step) => set({ currentStep: step }),
  
  updateService: (service) => 
    set((state) => ({ 
      data: { ...state.data, service } 
    })),
  
  updateDoctorSelection: (selection) =>
    set((state) => ({
      data: {
        ...state.data,
        doctorSelection: { ...state.data.doctorSelection, ...selection },
      },
    })),
  
  updatePatientDetails: (details) =>
    set((state) => ({
      data: {
        ...state.data,
        patientDetails: { ...state.data.patientDetails, ...details },
      },
    })),
  
  updateContactPreferences: (preferences) =>
    set((state) => ({
      data: {
        ...state.data,
        contactPreferences: { ...state.data.contactPreferences, ...preferences },
      },
    })),
  
  updateConfirmation: (confirmation) =>
    set((state) => ({
      data: {
        ...state.data,
        confirmation: { ...state.data.confirmation, ...confirmation },
      },
    })),
  
  resetBooking: () => set({ data: initialData, currentStep: 1 }),
}));