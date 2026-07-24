import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { User } from '@/types';

/**
 * Demo authentication: there is no auth server behind this app, so the session is
 * built locally from the submitted identity. The password is deliberately never
 * placed in the store or in localStorage. Replacing `authenticate` with a real
 * `POST /login` is the only change needed to make this genuine.
 */
const authenticate = async (email: string, name?: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const normalized = email.trim().toLowerCase();
  return { id: normalized, email: normalized, name: name?.trim() || normalized.split('@')[0]! };
};

export const login = createAsyncThunk('auth/login', (payload: { email: string }) =>
  authenticate(payload.email),
);

export const signup = createAsyncThunk(
  'auth/signup',
  (payload: { firstName: string; lastName: string; email: string }) =>
    authenticate(payload.email, `${payload.firstName} ${payload.lastName}`),
);

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = { user: null, status: 'idle', error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    clearAuthError(state) {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    // Login and signup share one lifecycle; matchers avoid six identical cases.
    builder
      .addMatcher(isAnyOf(login.pending, signup.pending), (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(isAnyOf(login.fulfilled, signup.fulfilled), (state, action) => {
        state.status = 'idle';
        state.user = action.payload;
      })
      .addMatcher(isAnyOf(login.rejected, signup.rejected), (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Something went wrong. Please try again.';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.user);
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
