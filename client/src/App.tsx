import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toast';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAuth } from '@/store/auth';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import UploadPage from '@/pages/UploadPage';
import DocumentDetailPage from '@/pages/DocumentDetailPage';
import PointsPage from '@/pages/PointsPage';
import RewardsPage from '@/pages/RewardsPage';

function RootPage() {
  const user = useAuth((s) => s.user);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const hasQuery = Array.from(searchParams.keys()).length > 0;
  const fromApp = (location.state as { fromApp?: boolean } | null)?.fromApp === true;

  if (!user && !hasQuery && !fromApp) {
    return <Navigate to="/landing" replace />;
  }
  return <HomePage />;
}

function LandingRoute() {
  const user = useAuth((s) => s.user);
  if (user) return <Navigate to="/" replace />;
  return <LandingPage />;
}

export default function App() {
  const bootstrap = useAuth((s) => s.bootstrap);
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<RootPage />} />
          <Route path="landing" element={<LandingRoute />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="upload" element={<UploadPage />} />
            <Route path="me/points" element={<PointsPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
