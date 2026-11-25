import { apiInstance } from './apiInstance';
import { API_ENDPOINTS } from './apiEndpoints';

/**
 * Getting back into an account after forgetting the password.
 *
 * The code is six digits and arrives by email, the same way the one at registration does,
 * so a student meets one flow rather than two.
 */

/**
 * Asks for a code.
 *
 * Refuses, rather than quietly succeeding, when there is nobody to send one to: 404
 * `ACCOUNT_NOT_FOUND` for an address with no account, 400 `CODE_TOO_SOON` for a second ask
 * inside the minute. It used to answer the same way whichever happened, so that the route
 * could not be used to learn who was a customer - which `POST /auth/register` answers
 * openly anyway, with a 409. `ResetPasswordModalPanel` reads those codes and offers the
 * sign-up screen or the inbox accordingly.
 */
export const requestPasswordReset = async (
  email: string,
  locale?: 'uk' | 'en',
): Promise<void> => {
  await apiInstance.post(API_ENDPOINTS.auth.forgotPassword, { email, locale });
};

/** Sets the new password. Every active session is signed out by the server. */
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
): Promise<void> => {
  await apiInstance.post(API_ENDPOINTS.auth.resetPassword, {
    email,
    code,
    new_password: newPassword,
  });
};
