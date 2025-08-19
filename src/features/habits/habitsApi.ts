import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '@/app/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  DocumentReference,
  getDoc,
} from 'firebase/firestore';
import type { RootState } from '@/app/store';
import { Habit } from '@/lib/types';

export const habitsApi = createApi({
  reducerPath: 'habitsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Habit'],
  endpoints: (build) => ({
    listHabits: build.query<Habit[], void>({
      async queryFn(): Promise<{ data: Habit[] }> {
        return { data: [] };
      },
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        const state = getState() as RootState;
        const uid = state.auth.user?.uid;

        if (!uid) {
          return;
        }

        const q = query(
          collection(db, 'users', uid, 'habits'),
          orderBy('createdAt', 'desc'),
        );

        const unsub = onSnapshot(q, (snap) => {
          const items: Habit[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Habit, 'id'>),
          }));

          updateCachedData((draft) => {
            draft.splice(0, draft.length, ...items);
          });
        });

        try {
          await cacheDataLoaded;
        } finally {
          await cacheEntryRemoved;
          unsub();
        }
      },
    }),

    addHabit: build.mutation<void, Partial<Habit>>({
      queryFn: async (body, { getState }): Promise<{ data: void }> => {
        const state = getState() as RootState;
        const uid = state.auth.user?.uid;

        if (!uid) {
          return { data: undefined };
        }

        await addDoc(collection(db, 'users', uid, 'habits'), {
          title: body.title ?? 'Untitled',
          description: body.description ?? '',
          category: body.category ?? 'other',
          targetDays: body.targetDays ?? 21,
          doneDates: [],
          completedDays: 0,

          createdAt: Date.now(),
          updatedAt: Date.now(),
          archived: body.archived ?? false,
        });

        return { data: undefined };
      },
    }),

    updateHabit: build.mutation<void, { id: string; patch: Partial<Habit> }>({
      queryFn: async ({ id, patch }, { getState }): Promise<{ data: void }> => {
        const state = getState() as RootState;
        const uid = state.auth.user?.uid;

        if (!uid) {
          return { data: undefined };
        }

        const ref: DocumentReference = doc(db, 'users', uid, 'habits', id);

        await updateDoc(ref, {
          ...patch,
          updatedAt: Date.now(),
        });

        return { data: undefined };
      },
    }),

    deleteHabit: build.mutation<void, string>({
      queryFn: async (id, { getState }): Promise<{ data: void }> => {
        const state = getState() as RootState;
        const uid = state.auth.user?.uid;

        if (!uid) {
          return { data: undefined };
        }

        const ref: DocumentReference = doc(db, 'users', uid, 'habits', id);

        await deleteDoc(ref);

        return { data: undefined };
      },
    }),

    toggleHabitDone: build.mutation<void, { id: string; date: string }>({
      async queryFn(
        { id, date },
        { getState },
      ): Promise<{ data: void } | { error: { message: string } }> {
        const state = getState() as RootState;
        const uid = state.auth.user?.uid;

        if (!uid) {
          return { error: { message: 'User not authenticated' } };
        }

        const ref = doc(db, 'users', uid, 'habits', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          return { error: { message: 'Habit not found' } };
        }

        const habit = snap.data() as Habit;

        let doneDates = habit.doneDates ?? [];

        if (doneDates.includes(date)) {
          doneDates = doneDates.filter((d) => d !== date);
        } else {
          doneDates = [...doneDates, date];
        }

        const completedDays = doneDates.length;

        await updateDoc(ref, {
          doneDates,
          completedDays,
          updatedAt: Date.now(),
        });

        return { data: undefined };
      },
    }),
  }),
});

export const {
  useListHabitsQuery,
  useAddHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useToggleHabitDoneMutation,
} = habitsApi;
