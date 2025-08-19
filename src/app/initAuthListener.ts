import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/app/firebase';
import { store } from '@/app/store';
import { setUser } from '@/features/auth/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { AuthUser } from '@/lib/types';

export const initAuthListener = () => {
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      const snap = await getDoc(doc(db, 'users', u.uid));
      const data = snap.data();

      const user: AuthUser = {
        uid: u.uid,
        email: u.email,
        displayName: data?.name ?? u.displayName ?? null,
        photoURL: u.photoURL ?? null,
      };

      store.dispatch(setUser(user));
    } else {
      store.dispatch(setUser(null));
    }
  });
};
