import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import { habitsApi } from '@/features/habits/habitsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [habitsApi.reducerPath]: habitsApi.reducer,
  },
  middleware: (gDM) => gDM().concat(habitsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
