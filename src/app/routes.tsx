import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

export function ProtectedRoute() {
  const user = useSelector((s: RootState) => s.auth.user);

  if (user === undefined) {
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}
