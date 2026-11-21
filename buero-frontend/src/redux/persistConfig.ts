/**
 * localStorage, but it can never take the app down with it.
 *
 * `PersistGate` renders nothing until rehydration settles, so a throw in here is a blank
 * page that no reload clears. And these calls do throw in the ordinary world: a private
 * window, blocked site data, a full quota. Forgetting the saved session is a small harm -
 * the student signs in again - while a white screen is a site that looks broken.
 */
const storage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Nothing is saved this time; the app carries on. */
    }
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* Already gone, as far as anyone can tell. */
    }
    return Promise.resolve();
  },
};

export const persistConfig = {
  key: 'root',
  storage,
  /**
   * The vocabulary is deliberately absent: it used to be persisted here, which meant
   * it survived logout and the next account signing in on the same browser inherited
   * the previous student's words. It now lives on the server, scoped to the account.
   */
  whitelist: ['auth'],
  blacklist: ['courseDetails'],
};
