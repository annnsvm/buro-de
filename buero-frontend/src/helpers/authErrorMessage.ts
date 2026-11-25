import axios from 'axios';
import type { TFunction } from 'i18next';

/**
 * Turning a failed sign-in into a sentence the reader can act on.
 *
 * What used to happen: the server threw an exception whose message had been written for
 * whoever was reading the log, the API put that message in the response body, and
 * `getErrorMessage` put it on the screen. So a student studying German through Ukrainian
 * mistyped a password and was told, in English, "Invalid credentials" - and one who chose
 * a short password was told "Password must be at least 9 characters".
 *
 * The server now names each failure instead (see `AUTH_ERROR` on the backend), and the
 * wording lives here, in both locales, next to everything else a person reads. Two things
 * follow from that: the server can reword its log messages without changing the screen, and
 * the screen can do more than print a sentence - `authFailure` is what lets the reset form
 * offer a sign-up button when the address turns out to have no account.
 */
export const AUTH_FAILURES = [
  /** No account uses this address. */
  'ACCOUNT_NOT_FOUND',
  /** The address is right, the password is not. */
  'WRONG_PASSWORD',
  /** Signing up with an address somebody already has. */
  'EMAIL_TAKEN',
  /** Asking to use a code that was never issued. */
  'CODE_NOT_REQUESTED',
  /** The code's fifteen minutes are up. */
  'CODE_EXPIRED',
  /** Six digits, and not these six. */
  'CODE_WRONG',
  /** Five wrong guesses: the code is burnt. */
  'CODE_ATTEMPTS_SPENT',
  /** Asked again inside the minute - the first code is still in the inbox. */
  'CODE_TOO_SOON',
  /** Nothing half-finished to resend a code for. */
  'NO_PENDING_REGISTRATION',
  /** The new password is the old one. */
  'SAME_PASSWORD',
  /** The request did not pass the server's own rules. */
  'VALIDATION_FAILED',
  /** The rate limit, which is a 429 and carries no code of its own. */
  'TOO_MANY_REQUESTS',
  /** The request never reached the server, so there is no status to read. */
  'NETWORK',
  /** It reached the server and the server broke. */
  'SERVER',
  /** Something the server has not taught this screen about yet. */
  'UNKNOWN',
] as const;

export type AuthFailure = (typeof AUTH_FAILURES)[number];

const NAMED = new Set<string>(AUTH_FAILURES);

const fromName = (value: unknown): AuthFailure | null =>
  typeof value === 'string' && NAMED.has(value) ? (value as AuthFailure) : null;

/**
 * Which of the known failures this is.
 *
 * Takes the error at any point on its way up: the axios rejection straight from the API,
 * or the name a thunk has already reduced it to and handed on through `rejectWithValue`
 * (which `unwrap()` rethrows as an `Error` whose message is that name).
 */
export const authFailure = (error: unknown): AuthFailure => {
  const direct = fromName(error);
  if (direct) return direct;

  if (error instanceof Error) {
    const named = fromName(error.message);
    if (named) return named;
  }

  if (axios.isAxiosError(error)) {
    const body = error.response?.data as { code?: unknown } | undefined;
    const coded = fromName(body?.code);
    if (coded) return coded;

    const status = error.response?.status;
    /** No response at all: the browser never got an answer to read a status off. */
    if (status === undefined) return 'NETWORK';
    if (status === 429) return 'TOO_MANY_REQUESTS';
    if (status >= 500) return 'SERVER';
  }

  return 'UNKNOWN';
};

/**
 * The sentence to put on the screen.
 *
 * `fallbackKey` is the screen's own wording for a failure nothing here recognises - "could
 * not log in", "could not send the code" - so that an unknown error still reads as
 * something to do with what the person was trying to do.
 */
export const authErrorText = (
  error: unknown,
  t: TFunction,
  fallbackKey: string,
): string => {
  const failure = authFailure(error);
  if (failure === 'UNKNOWN') return t(fallbackKey);
  return t(`auth.errors.${failure}`);
};

/**
 * The sentence for a field the form refused, from the key the schema named.
 *
 * `loginSchema` and `signUpSchema` are built at import, before anyone has chosen a
 * language, so their messages are i18n keys rather than text. This turns one into text and
 * passes `undefined` straight through, which is what `FormField` wants when the field is
 * fine. A message that is not a key comes back unchanged - i18next returns what it was
 * given when it has nothing for it - so a stray sentence still shows rather than vanishing.
 */
export const translateFieldError = (
  message: string | undefined,
  t: TFunction,
): string | undefined => (message ? t(message) : undefined);
