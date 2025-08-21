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
import { format } from 'date-fns';

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

    listHabitsByDate: build.query<Habit[], string | void>({
      async queryFn() {
        return { data: [] }; // базовый ответ
      },
      async onCacheEntryAdded(
        date,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        const state = getState() as RootState;
        const uid = state.auth.user?.uid;

        if (!uid) {
          return;
        }

        const targetDate = date ?? format(new Date(), 'yyyy-MM-dd');
        const today = format(new Date(), 'yyyy-MM-dd');

        const q = query(
          collection(db, 'users', uid, 'habits'),
          orderBy('createdAt', 'desc'),
        );

        const unsub = onSnapshot(q, async (snap) => {
          const items: Habit[] = [];

          for (const d of snap.docs) {
            const habit = { id: d.id, ...(d.data() as Omit<Habit, 'id'>) };
            const ref = doc(db, 'users', uid, 'habits', habit.id);

            if (habit.completedDays >= habit.targetDays && !habit.archived) {
              await updateDoc(ref, { archived: true, updatedAt: Date.now() });
              habit.archived = true;
            } else if (
              habit.completedDays < habit.targetDays &&
              habit.archived
            ) {
              await updateDoc(ref, { archived: false, updatedAt: Date.now() });
              habit.archived = false;
            }

            if (targetDate === today) {
              if (habit.completedDays < habit.targetDays) {
                items.push(habit);
              }
            } else if (targetDate < today) {
              if (habit.doneDates?.includes(targetDate)) {
                items.push(habit);
              }
            } else {
              if (habit.completedDays < habit.targetDays) {
                items.push(habit);
              }
            }
          }

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
          doneDates: body.doneDates ?? [],
          completedDays: body.doneDates?.length ?? 0,
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

        const snap = await getDoc(ref);

        if (!snap.exists()) {
          return { data: undefined };
        }

        const habit = snap.data() as Habit;

        const doneDates = patch.doneDates ?? habit.doneDates ?? [];
        const completedDays = doneDates.length;

        const targetDays = patch.targetDays ?? habit.targetDays ?? 21;
        let archived = habit.archived ?? false;

        if (completedDays >= targetDays) {
          archived = true;
        } else {
          archived = false;
        }

        await updateDoc(ref, {
          ...patch,
          doneDates,
          completedDays,
          targetDays,
          archived,
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
        const targetDays = habit.targetDays ?? 21;

        let archived = habit.archived ?? false;

        if (completedDays >= targetDays) {
          archived = true;
        } else {
          archived = false;
        }

        await updateDoc(ref, {
          doneDates,
          completedDays,
          archived,
          updatedAt: Date.now(),
        });

        return { data: undefined };
      },
    }),
  }),
});

export const {
  useListHabitsQuery,
  useListHabitsByDateQuery,
  useAddHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useToggleHabitDoneMutation,
} = habitsApi;
