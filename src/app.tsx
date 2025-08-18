import { RouterProvider } from 'react-router-dom';

import ErrorBoundary from './components/error-boundary';
import { router } from './router';

export const App = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);
