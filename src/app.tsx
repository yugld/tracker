import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from 'sonner';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { Loading } from '@/components/Loading';
import { router } from './app/router';

export const App = () => {
  const { initialized } = useAppSelector((state: RootState) => state.auth);

  if (!initialized) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </Suspense>
  );
};
