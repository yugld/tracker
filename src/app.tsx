import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';

import ErrorBoundary from './components/error-boundary';
import { ProtectedRoute } from './app/routes';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import EditPage from './pages/EditPage';
import HabitPage from './pages/HabitPage';
import HomePage from './pages/HomePage';
import { Toaster } from 'sonner';
import { RootState } from '@reduxjs/toolkit/query';
import { useSelector } from 'react-redux';
import { Loading } from './components/ui/loading';

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
            <Route path="/edit/:type/:id?" element={<EditPage />} />
            <Route path="/habit/:id" element={<HabitPage />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ErrorBoundary>
  );
};
