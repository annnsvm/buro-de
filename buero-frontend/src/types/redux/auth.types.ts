type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'error';

type AuthState = {
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
};


type LoginPayload = {
  email: string;
  password: string;
  redirectTo?: string;
};

export type { AuthStatus,AuthState, LoginPayload };
