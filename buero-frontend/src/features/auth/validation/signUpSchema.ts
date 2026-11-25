import { z } from 'zod';

/**
 * The messages are i18n keys - see the note in `loginSchema` for why, and
 * `translateFieldError` in `@/helpers/authErrorMessage` for where they are turned into
 * sentences.
 */
export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'auth.validation.nameRequired' })
    .max(255, { message: 'auth.validation.nameTooLong' }),

  email: z
    .string()
    .min(1, { message: 'auth.validation.emailRequired' })
    .pipe(
      z.email({
        message: 'auth.validation.emailInvalid',
      }),
    ),

  /** One message for the whole rule, so it is fixed in one go. */
  password: z
    .string()
    .min(1, { message: 'auth.validation.passwordRequired' })
    .min(9, { message: 'auth.validation.passwordRule' })
    .regex(/(?=.*[A-Z])/, { message: 'auth.validation.passwordRule' })
    .regex(/(?=.*[0-9])/, { message: 'auth.validation.passwordRule' }),
});
