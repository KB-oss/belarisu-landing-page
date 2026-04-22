// lib/schemas/booking-schemas.ts
import { z } from 'zod';

// Define enum values as const arrays for reuse
const SERVICE_VALUES = [
  'orthodontics-dental',
  'surgery',
  'speech-therapy',
  'nutritional-support',
  'psychosocial-care',
  'ent-care',
  'general-assessment'
] as const;

const AGE_GROUP_VALUES = [
  '0-12-months',
  '1-3-years',
  '4-12-years',
  '13-17-years',
  '18-plus'
] as const;

const CONTACT_METHOD_VALUES = [
  'phone',
  'email',
  'whatsapp',
  'walk-in'
] as const;

const TIME_SLOT_VALUES = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM'
] as const;

// Create enums
export const ServiceEnum = z.enum(SERVICE_VALUES);
export const AgeGroupEnum = z.enum(AGE_GROUP_VALUES);
export const ContactMethodEnum = z.enum(CONTACT_METHOD_VALUES);
export const TimeSlotEnum = z.enum(TIME_SLOT_VALUES);

// Export types
export type ServiceType = z.infer<typeof ServiceEnum>;
export type AgeGroup = z.infer<typeof AgeGroupEnum>;
export type ContactMethod = z.infer<typeof ContactMethodEnum>;
export type TimeSlot = z.infer<typeof TimeSlotEnum>;

// Schemas with required errors
export const serviceSchema = z.object({
  service: ServiceEnum.refine(val => val !== undefined, {
    message: 'Please select a service'
  }),
});

export const patientDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  ageGroup: AgeGroupEnum.refine(val => val !== undefined, {
    message: 'Please select an age group'
  }),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  briefDescription: z.string().max(500, 'Description is too long').optional(),
});

export const contactPreferencesSchema = z.object({
  contactMethod: ContactMethodEnum.refine(val => val !== undefined, {
    message: 'Please select a contact method'
  }),
  preferredDay: z.string().nullable().optional(),
  preferredTimeSlot: TimeSlotEnum.nullable().optional(),
  isFlexible: z.boolean(),
});

export const confirmationSchema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms to continue',
  }),
});

// Types for form data
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type PatientDetailsFormData = z.infer<typeof patientDetailsSchema>;
export type ContactPreferencesFormData = z.infer<typeof contactPreferencesSchema>;
export type ConfirmationFormData = z.infer<typeof confirmationSchema>;