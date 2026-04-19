import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { rootReducer } from '@/redux/rootReducer';
import { signupThunk } from '@/redux/slices/auth/authThunks';
import { setStore } from '@/redux/storeRef';

import { TEST_API_BASE_URL } from '../../../constants';
import { server } from '../../../mocks/server';

describe('signupThunk', () => {
  it('fulfills and marks authenticated when register returns user', async () => {
    server.use(
      http.post(`${TEST_API_BASE_URL}/auth/register`, () =>
        HttpResponse.json({
          user: {
            id: 'u-new',
            email: 'new@test.com',
            name: 'New User',
            role: 'student',
            language: 'en',
          },
        }),
      ),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);

    await store.dispatch(
      signupThunk({
        name: 'New User',
        email: 'new@test.com',
        password: 'SecretPass1',
        role: 'student',
        language: 'en',
      }),
    );

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().user.currentUser?.email).toBe('new@test.com');
  });
});
