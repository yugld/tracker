import { auth, db, googleProvider } from '@/app/firebase';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthState = {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error?: string;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
  initialized: false,
};

const mapUser = (
  u: {
    uid: string;
    email: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  } | null,
): AuthUser | null =>
  u
    ? {
        uid: u.uid,
        email: u.email ?? null,
        displayName: u.displayName ?? null,
        photoURL: u.photoURL ?? null,
      }
    : null;

export const registerEmail = createAsyncThunk<
  AuthUser,
  { email: string; password: string; name: string }
>('auth/registerEmail', async ({ email, password, name }) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(res.user, { displayName: name });

  // создаем документ в Firestore
  await setDoc(doc(db, 'users', res.user.uid), {
    uid: res.user.uid,
    email,
    name,
    photoURL: res.user.photoURL ?? null,
    createdAt: Date.now(),
  });

  return mapUser({
    uid: res.user.uid,
    email,
    displayName: name,
    photoURL: res.user.photoURL ?? null,
  })!;
});

export const loginEmail = createAsyncThunk<
  AuthUser,
  { email: string; password: string }
>('auth/loginEmail', async ({ email, password }) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  const profileSnap = await getDoc(doc(db, 'users', res.user.uid));
  const nameFromDb = profileSnap.exists()
    ? ((profileSnap.data() as any).name ?? null)
    : null;

  return mapUser({
    uid: res.user.uid,
    email: res.user.email,
    displayName: nameFromDb ?? res.user.displayName ?? null,
    photoURL: res.user.photoURL ?? null,
  })!;
});

export const loginGoogle = createAsyncThunk<AuthUser>(
  'auth/loginGoogle',
  async () => {
    const res = await signInWithPopup(auth, googleProvider);

    const ref = doc(db, 'users', res.user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid: res.user.uid,
        email: res.user.email,
        name: res.user.displayName ?? '',
        photoURL: res.user.photoURL ?? null,
        createdAt: Date.now(),
      });
    }

    const nameFromDb =
      (await getDoc(ref)).data()?.name ?? res.user.displayName ?? null;

    return mapUser({
      uid: res.user.uid,
      email: res.user.email,
      displayName: nameFromDb,
      photoURL: res.user.photoURL ?? null,
    })!;
  },
);

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
    const rejected = (s: AuthState, a: any) => {
      s.status = 'error';
      s.error = a.error?.message ?? 'Auth error';
    };

    b.addCase(registerEmail.pending, pending)
      .addCase(registerEmail.fulfilled, fulfilled)
      .addCase(registerEmail.rejected, rejected);

    b.addCase(loginEmail.pending, pending)
      .addCase(loginEmail.fulfilled, fulfilled)
      .addCase(loginEmail.rejected, rejected);

    b.addCase(loginGoogle.pending, pending)
      .addCase(loginGoogle.fulfilled, fulfilled)
      .addCase(loginGoogle.rejected, rejected);

    b.addCase(logout.fulfilled, (s) => {
      s.user = null;
      s.status = 'idle';
    });
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
