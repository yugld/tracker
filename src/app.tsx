import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorBoundary from './components/error-boundary';
import { ProtectedRoute } from './app/routes';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import HabitPage from './pages/HabitPage';
import HomePage from './pages/HomePage';
import { Toaster } from 'sonner';
import { RootState } from '@reduxjs/toolkit/query';
import { useSelector } from 'react-redux';
import { Loading } from './components/ui/loading';
import NotFound from './pages/NotFoundPage';

export const App = () => {
  const { initialized } = useSelector((state: RootState) => state.auth);

  if (!initialized) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/habit/:id" element={<HabitPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
};
