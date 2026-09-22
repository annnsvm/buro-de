import { describe, expect, it } from 'vitest';

import { rootReducer } from '@/redux/rootReducer';
import { logout } from '@/redux/slices/auth/authSlice';
import { logOutThunk } from '@/redux/slices/auth/authThunks';

/**
 * Signing out has to drop every slice, not just the ones a developer remembered.
 * The word list made this visible: it stayed in memory after a sign-out, so the next
 * student to sign in on the same browser saw the previous one's words until their own
 * arrived from the server.
 */
describe('session end resets the store', () => {
  const stateWithPreviousAccount = () => {
    const base = rootReducer(undefined, { type: '@@INIT' });
    return {
      ...base,
      vocabulary: {
        ...base.vocabulary,
        words: [
          {
            id: 'w1',
            word: 'Termin',
            translation: 'зустріч',
            category: 'vocabulary' as const,
            createdAt: '2026-09-01T00:00:00.000Z',
          },
        ],
        status: 'succeeded' as const,
      },
      auth: { ...base.auth, isAuthenticated: true },
    };
  };

  it('clears the word list when the sign out button is used', () => {
    const next = rootReducer(stateWithPreviousAccount(), {
      type: logOutThunk.fulfilled.type,
    });

    expect(next.vocabulary.words).toEqual([]);
    expect(next.auth.isAuthenticated).toBe(false);
  });

  it('clears the word list when the session could not be refreshed', () => {
    const next = rootReducer(stateWithPreviousAccount(), logout());

    expect(next.vocabulary.words).toEqual([]);
  });

  it('leaves the store alone for unrelated actions', () => {
    const state = stateWithPreviousAccount();
    const next = rootReducer(state, { type: 'something/else' });

    expect(next.vocabulary.words).toHaveLength(1);
  });
});
