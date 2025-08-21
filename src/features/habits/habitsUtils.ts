import { db } from '@/app/firebase';
import { RootState } from '@/app/store';
import { Habit } from '@/lib/types';
import { doc, DocumentReference, updateDoc } from 'firebase/firestore';

export async function getUid(getState: () => unknown) {
  const state = getState() as RootState;

  return state.auth.user?.uid;
}

export function habitRef(uid: string, id: string) {
  return doc(db, 'users', uid, 'habits', id);
}

export function calculateArchived(habit: Habit, doneDates?: string[]) {
  const completedDays = doneDates?.length ?? habit.completedDays ?? 0;
  const targetDays = habit.targetDays ?? 21;

  return completedDays >= targetDays;
}

export async function saveHabitUpdate(
  ref: DocumentReference,
  habitPatch: Partial<Habit> & {
    doneDates?: string[];
    completedDays?: number;
    archived?: boolean;
  },
) {
  const { doneDates, completedDays, archived, ...rest } = habitPatch;

  await updateDoc(ref, {
    ...rest,
    doneDates,
    completedDays,
    archived,
    updatedAt: Date.now(),
  });
}
