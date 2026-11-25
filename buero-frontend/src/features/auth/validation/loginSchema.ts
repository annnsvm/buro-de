import { z } from 'zod';

/**
 * The messages are i18n keys, not sentences.
 *
 * A schema has no locale: it is built once, at import, long before anyone has chosen a
 * language. So it names what went wrong and the form translates the name at render -
 * `translateFieldError` in `@/helpers/authErrorMessage`. Before that, every one of these
 * read out in English to students who had come for German through Ukrainian.
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'auth.validation.emailRequired' })
    .pipe(
      z.email({
        message: 'auth.validation.emailInvalid',
      }),
    ),

  /**
   * One message for the whole rule rather than three.
   *
   * Told in pieces, a password is corrected in pieces - add a digit, resubmit, now a
   * capital, resubmit. The rule is short enough to say at once, and it is the same
   * sentence the reset screen shows above the field.
   */
  password: z
    .string()
    .min(1, { message: 'auth.validation.passwordRequired' })
    .min(9, { message: 'auth.validation.passwordRule' })
    .regex(/(?=.*[A-Z])/, { message: 'auth.validation.passwordRule' })
    .regex(/(?=.*[0-9])/, { message: 'auth.validation.passwordRule' }),
});

export default loginSchema;
