import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorBoundary from '@/components/error-boundary';
import { ProtectedRoute } from '@/app/routes';
import AuthPage from '@/pages/AuthPage';
import HabitPage from '@/pages/HabitPage';
import HomePage from '@/pages/HomePage';
import { Toaster } from 'sonner';
import NotFound from '@/pages/NotFoundPage';
import { RootState } from '@/app/store';
import { useAppSelector } from '@/app/hooks';
import { Loading } from '@/components/Loading';
import { Layout } from '@/components/Layout';

export const App = () => {
  const { initialized } = useAppSelector((state: RootState) => state.auth);

  if (!initialized) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/habit/:id" element={<HabitPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
};
