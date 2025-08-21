import { auth, googleProvider } from '@/app/firebase';
import { AuthState, AuthUser, RejectedAction } from '@/lib/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  createAuthThunk,
  saveUserIfNotExists,
  buildAuthUser,
} from './authUtils';

const initialState: AuthState = {
  user: null,
  status: 'idle',
  initialized: false,
};

export const registerEmail = createAuthThunk<{
  email: string;
  password: string;
  name: string;
}>('auth/registerEmail', async ({ email, password, name }) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(res.user, { displayName: name });
  await saveUserIfNotExists(res.user, name);

  return buildAuthUser(res.user, name);
});

export const loginEmail = createAuthThunk<{ email: string; password: string }>(
  'auth/loginEmail',
  async ({ email, password }) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const name = await saveUserIfNotExists(res.user);

    return buildAuthUser(res.user, name);
  },
);

export const loginGoogle = createAuthThunk('auth/loginGoogle', async () => {
  const res = await signInWithPopup(auth, googleProvider);
  const name = await saveUserIfNotExists(res.user);

  return buildAuthUser(res.user, name);
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, { payload }: { payload: AuthUser | null }) {
      state.user = payload;
      state.status = payload ? 'authenticated' : 'idle';
      state.error = undefined;
      state.initialized = true;
    },
  },
  extraReducers: (b) => {
    const pending = (s: AuthState) => {
      s.status = 'loading';
      s.error = undefined;
    };
    const fulfilled = (s: AuthState, a: PayloadAction<AuthUser>) => {
      s.user = a.payload;
      s.status = a.payload ? 'authenticated' : 'idle';
    };
    const rejected = (s: AuthState, a: RejectedAction) => {
      s.status = 'error';
      s.error = a.error?.message ?? 'Auth error';
    };

    [registerEmail, loginEmail, loginGoogle].forEach((thunk) => {
      b.addCase(thunk.pending, pending)
        .addCase(thunk.fulfilled, fulfilled)
        .addCase(thunk.rejected, rejected);
    });

    b.addCase(logout.fulfilled, (s) => {
      s.user = null;
      s.status = 'idle';
    });
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
