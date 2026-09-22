const storage = {
  getItem: (key: string): Promise<string | null> => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string): Promise<void> =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string): Promise<void> => Promise.resolve(localStorage.removeItem(key)),
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
