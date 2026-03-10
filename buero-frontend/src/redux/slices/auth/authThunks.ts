import { apiInstance } from '@/api/apiInstance';
import { LoginPayload } from '@/types/redux/auth.types';
import { createAsyncThunk } from '@reduxjs/toolkit';

// TODO: login, logout, refresh thunks when API is ready

export const loginThunk = createAsyncThunk<void, LoginPayload>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await apiInstance.post('/auth/login', { email, password });
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  },
);
