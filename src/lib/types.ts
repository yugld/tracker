import { SerializedError } from '@reduxjs/toolkit';

export type Habit = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  targetDays: number;
  completedDays: number;
  doneDates: string[];
  createdAt: Date | string;
  updatedAt: number;
  archived?: boolean;
};

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

export type AuthState = {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error?: string;
  initialized: boolean;
};

export type RejectedAction = {
  error: SerializedError;
};
