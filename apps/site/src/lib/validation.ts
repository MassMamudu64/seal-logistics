import { z } from 'zod';
import { COUNTRIES } from './pricing';

/**
 * Booking/quote request schema — shared between client validation and the
 * route handler. ONE schema, two consumers: cannot drift.
 */
export const BookingSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name.').max(120),
    email: z.string().trim().email('Enter a valid email.'),
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number.')
      .max(32)
      .regex(/^[+\d\s().-]+$/, 'Phone may only contain digits, spaces, and + ( ) - .'),
    from: z.enum(COUNTRIES),
    to: z.enum(COUNTRIES),
    weight: z
      .number({ invalid_type_error: 'Weight must be a number.' })
      .nonnegative('Weight must be 0 or more.')
      .max(10_000, 'Contact us for shipments over 10,000.')
      .optional(),
    description: z.string().trim().max(2_000).optional(),
    /** Honeypot — must be empty. Real users never see this field. */
    company_website: z.string().max(0, 'Spam detected.').optional().default(''),
    /** GDPR consent flag — must be true to submit. */
    consent: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the privacy policy to continue.' }),
    }),
  })
  .refine((v) => v.from !== v.to, {
    path: ['to'],
    message: 'Origin and destination must differ.',
  });

export type BookingInput = z.infer<typeof BookingSchema>;

/** Server-only: trims keys we should never persist. */
export function sanitizeForStorage(input: BookingInput) {
  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    from: input.from,
    to: input.to,
    ...(input.weight !== undefined && { weight: input.weight }),
    ...(input.description !== undefined && { description: input.description }),
  };
}
