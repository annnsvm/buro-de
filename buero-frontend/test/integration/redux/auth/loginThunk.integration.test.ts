import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { loginThunk } from '@/redux/slices/auth/authThunks';
import { rootReducer } from '@/redux/rootReducer';
import { setStore } from '@/redux/storeRef';

import { TEST_API_BASE_URL } from '../../../constants';
import { server } from '../../../mocks/server';

describe('loginThunk', () => {
  it('fulfills and marks session authenticated when API returns user', async () => {
    server.use(
      http.post(`${TEST_API_BASE_URL}/auth/login`, () =>
        HttpResponse.json({
          user: {
            id: 'u1',
            email: 'student@test.com',
            name: 'Student',
            role: 'student',
            language: 'de',
          },
        }),
      ),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);

    await store.dispatch(
      loginThunk({ email: 'student@test.com', password: 'SecretPass1' }),
    );

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.status).toBe('idle');
    expect(store.getState().user.currentUser?.email).toBe('student@test.com');
  });

  it('rejected sets auth error state', async () => {
    server.use(
      http.post(`${TEST_API_BASE_URL}/auth/login`, () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 }),
      ),
    );

    const store = configureStore({ reducer: rootReducer });
    setStore(store);

    await store.dispatch(loginThunk({ email: 'x@test.com', password: 'wrong' }));

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.status).toBe('error');
    expect(store.getState().auth.error).toBeTruthy();
  });
});
