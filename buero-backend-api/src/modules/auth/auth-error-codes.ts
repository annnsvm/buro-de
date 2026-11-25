import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

/**
 * Machine-readable names for the ways signing in can fail.
 *
 * Before these existed the only thing an error carried was an English sentence written for
 * whoever was reading the server log - "Invalid credentials", "No pending registration for
 * this email" - and the frontend put that sentence straight on the screen. A student
 * learning German through Ukrainian would mistype a password and be told, in English, that
 * their credentials were invalid.
 *
 * So the sentence stops being the contract. The code is: the server says which of the
 * known failures happened, the frontend owns the wording, and the wording can then live in
 * both locales and change without touching the API. The message stays on the exception for
 * the log and for anyone reading Swagger, and is never what the student sees.
 */
export const AUTH_ERROR = {
  /** No account uses this address - at login, at reset, or after it was deleted. */
  accountNotFound: "ACCOUNT_NOT_FOUND",
  /** The address is right, the password is not. */
  wrongPassword: "WRONG_PASSWORD",
  /** Registration refused: somebody already has this address. */
  emailTaken: "EMAIL_TAKEN",
  /** A code was asked for, and none was ever issued for this address. */
  codeNotRequested: "CODE_NOT_REQUESTED",
  /** There was a code, and its fifteen minutes are up. */
  codeExpired: "CODE_EXPIRED",
  /** Six digits, and not these six. */
  codeWrong: "CODE_WRONG",
  /** Five wrong guesses: the code is burnt and a new one is needed. */
  codeAttemptsSpent: "CODE_ATTEMPTS_SPENT",
  /** Asked again inside the cooldown - the first code is still in the inbox. */
  codeTooSoon: "CODE_TOO_SOON",
  /** Nothing half-finished to resend a code for. */
  noPendingRegistration: "NO_PENDING_REGISTRATION",
  /** The new password is the old one. */
  samePassword: "SAME_PASSWORD",
  /** The request itself did not pass the DTO rules. */
  validationFailed: "VALIDATION_FAILED",
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];

/**
 * The `message` is for the log and for Swagger; the `code` is for the client.
 *
 * Both travel in the exception's object payload, which `AllExceptionsFilter` copies into
 * the response body - so adding a code here is all it takes for the frontend to see one.
 */
type CodedPayload = { code: AuthErrorCode; message: string };

const payload = (code: AuthErrorCode, message: string): CodedPayload => ({
  code,
  message,
});

export const badRequest = (code: AuthErrorCode, message: string) =>
  new BadRequestException(payload(code, message));

export const unauthorized = (code: AuthErrorCode, message: string) =>
  new UnauthorizedException(payload(code, message));

export const notFound = (code: AuthErrorCode, message: string) =>
  new NotFoundException(payload(code, message));

export const conflict = (code: AuthErrorCode, message: string) =>
  new ConflictException(payload(code, message));
