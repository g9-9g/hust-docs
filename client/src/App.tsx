import { useEffect, useRef } from 'react';
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
import { ConfirmDialog } from '@/components/ui/confirm';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAuth } from '@/store/auth';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import UploadPage from '@/pages/UploadPage';
import DocumentDetailPage from '@/pages/DocumentDetailPage';
import SubjectsPage from '@/pages/SubjectsPage';
import SubjectDetailPage from '@/pages/SubjectDetailPage';
import PointsPage from '@/pages/PointsPage';
import RewardsPage from '@/pages/RewardsPage';

function RootPage() {
  const user = useAuth((s) => s.user);
  const initialized = useAuth((s) => s.initialized);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const hasQuery = Array.from(searchParams.keys()).length > 0;
  const fromApp = (location.state as { fromApp?: boolean } | null)?.fromApp === true;
  // Khi đã hiển thị HomePage thì giữ nguyên, kể cả khi user xóa hết filter (URL về `/`).
  const stickyHome = useRef(false);

  if (!initialized) return null;
  if (stickyHome.current || user || hasQuery || fromApp) {
    stickyHome.current = true;
    return <HomePage />;
  }
  return <Navigate to="/landing" replace />;
}

function LandingRoute() {
  const user = useAuth((s) => s.user);
  if (user) return <Navigate to="/" replace />;
  return <LandingPage />;
}

function LoginRoute() {
  const user = useAuth((s) => s.user);
  const initialized = useAuth((s) => s.initialized);
  // Chờ bootstrap xong trước khi quyết định redirect, tránh nháy LoginPage rồi mới redirect.
  if (!initialized) return null;
  if (user) return <Navigate to="/" replace />;
  return <LoginPage />;
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
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/:id" element={<SubjectDetailPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="login" element={<LoginRoute />} />
          <Route path="register" element={<Navigate to="/login" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path="upload" element={<UploadPage />} />
            <Route path="me/points" element={<PointsPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
      <ConfirmDialog />
    </BrowserRouter>
  );
}
