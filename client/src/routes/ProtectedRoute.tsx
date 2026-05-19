import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';

export function ProtectedRoute() {
  const user = useAuth((s) => s.user);
  const initialized = useAuth((s) => s.initialized);
  const location = useLocation();
  if (!initialized) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
}
