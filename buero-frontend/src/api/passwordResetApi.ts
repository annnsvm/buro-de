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
 * Succeeds whether or not the address has an account - the server answers the same way
 * either way, so that this cannot be used to find out who is a customer. Which means the
 * screen must not promise that an email is on its way to *this* address; it says what it
 * can honestly say, that if the account exists the code has been sent.
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
