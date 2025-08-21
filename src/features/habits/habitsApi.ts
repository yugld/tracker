import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '@/app/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { Habit } from '@/lib/types';
import { getUid, habitRef, calculateArchived } from './habitsUtils';

export const habitsApi = createApi({
  reducerPath: 'habitsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Habit'],
  endpoints: (build) => ({
    listHabits: build.query<Habit[], void>({
      async queryFn() {
        return { data: [] };
      },
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        const uid = await getUid(getState);

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
      queryFn: async (body, { getState }) => {
        const uid = await getUid(getState);

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
      queryFn: async ({ id, patch }, { getState }) => {
        const uid = await getUid(getState);

        if (!uid) {
          return { data: undefined };
        }

        const ref = habitRef(uid, id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          return { data: undefined };
        }

        const habit = snap.data() as Habit;
        const doneDates = patch.doneDates ?? habit.doneDates ?? [];
        const archived = calculateArchived(habit, doneDates);
        const completedDays = doneDates.length;
        const targetDays = patch.targetDays ?? habit.targetDays ?? 21;

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
      queryFn: async (id, { getState }) => {
        const uid = await getUid(getState);

        if (!uid) {
          return { data: undefined };
        }

        await deleteDoc(habitRef(uid, id));

        return { data: undefined };
      },
    }),

    toggleHabitDone: build.mutation<void, { id: string; date: string }>({
      async queryFn({ id, date }, { getState }) {
        const uid = await getUid(getState);

        if (!uid) {
          return { error: { message: 'User not authenticated' } };
        }

        const ref = habitRef(uid, id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          return { error: { message: 'Habit not found' } };
        }

        const habit = snap.data() as Habit;
        let doneDates = habit.doneDates ?? [];

        doneDates = doneDates.includes(date)
          ? doneDates.filter((d) => d !== date)
          : [...doneDates, date];

        const archived = calculateArchived(habit, doneDates);
        const completedDays = doneDates.length;

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
  useAddHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useToggleHabitDoneMutation,
} = habitsApi;
