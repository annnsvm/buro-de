import { AuthState } from '@/types/redux/auth.types';
import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './authThunks';

const initialState: AuthState = {
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: builder => 
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      }),
});

export const authReducer = authSlice.reducer;
export const { resetAuthError, logout } = authSlice.actions;
