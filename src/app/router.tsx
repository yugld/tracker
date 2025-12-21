import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ErrorBoundary from '@/components/error-boundary';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from './routes';
import NotFound from '@/pages/NotFoundPage';

const AuthPage = lazy(() => import('@/pages/AuthPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const HabitPage = lazy(() => import('@/pages/HabitPage'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/habit/:id',
            element: <HabitPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
