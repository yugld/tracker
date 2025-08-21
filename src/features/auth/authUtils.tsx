import { db } from '@/app/firebase';
import { AuthUser } from '@/lib/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const mapUser = (
  u:
    | User
    | {
        uid: string;
        email: string | null;
        displayName?: string | null;
        photoURL?: string | null;
      }
    | null,
): AuthUser | null =>
  u
    ? {
        uid: u.uid,
        email: u.email ?? null,
        displayName: u.displayName ?? null,
        photoURL: u.photoURL ?? null,
      }
    : null;

export const saveUserIfNotExists = async (user: User, name?: string) => {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      name: name ?? user.displayName ?? '',
      photoURL: user.photoURL ?? null,
      createdAt: Date.now(),
    });
  }

  const data = (await getDoc(ref)).data();

  return data?.name ?? user.displayName ?? null;
};

export const buildAuthUser = (user: User, name?: string): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: name ?? user.displayName ?? null,
  photoURL: user.photoURL ?? null,
});

export const createAuthThunk = <Args = void,>(
  type: string,
  cb: (args: Args) => Promise<
    | User
    | {
        uid: string;
        email: string | null;
        displayName?: string | null;
        photoURL?: string | null;
      }
  >,
) =>
  createAsyncThunk<AuthUser, Args>(type, async (args) => {
    const user = await cb(args);

    return mapUser(user)!;
  });
