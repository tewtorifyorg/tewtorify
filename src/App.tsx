// ============================================================
// Tewtorify — Main Application (Routing)
// ============================================================

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import GuardianDashboardPage from '@/pages/GuardianDashboardPage';
import GuardianPostRequestPage from '@/pages/GuardianPostRequestPage';
import TutorDashboardPage from '@/pages/TutorDashboardPage';
import TutorApplyPage from '@/pages/TutorApplyPage';
import TutorProfilePage from '@/pages/TutorProfilePage';
import TutorBrowseRequestsPage from '@/pages/TutorBrowseRequestsPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminVerificationsPage from '@/pages/AdminVerificationsPage';
import AdminAdVerificationsPage from '@/pages/AdminAdVerificationsPage';
import AdminMatchesPage from '@/pages/AdminMatchesPage';
import AdminDonationsPage from '@/pages/AdminDonationsPage';
import AdminAdminsPage from '@/pages/AdminAdminsPage';
import BrowseAdsPage from '@/pages/BrowseAdsPage';
import BrowseTeachersPage from '@/pages/BrowseTeachersPage';
import DonatePage from '@/pages/DonatePage';

// Remaining placeholder pages (will be implemented later)
import {
  GuardianMatchesPage,
  GuardianPostAdPage,
  GuardianReviewsPage,
} from '@/pages/PlaceholderPages';

// ---------- Layout Wrappers ----------

/** Main layout with header + footer (most pages) */
function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/** Auth layout — no header/footer (login/signup get their own design) */
function AuthLayout() {
  return <Outlet />;
}

// ---------- App Component ----------

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ---- Auth Pages (no header/footer) ---- */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* ---- Main Layout (header + footer) ---- */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse-ads" element={<BrowseAdsPage />} />
            <Route path="/browse-teachers" element={<BrowseTeachersPage />} />
            <Route path="/donate" element={<DonatePage />} />

            {/* Guardian Routes (auth required, guardian role) */}
            <Route
              path="/guardian/dashboard"
              element={
                <ProtectedRoute allowedRoles={['guardian']}>
                  <GuardianDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/post-request"
              element={
                <ProtectedRoute allowedRoles={['guardian']}>
                  <GuardianPostRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/matches/:requestId"
              element={
                <ProtectedRoute allowedRoles={['guardian']}>
                  <GuardianMatchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/post-ad"
              element={
                <ProtectedRoute allowedRoles={['guardian']}>
                  <GuardianPostAdPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guardian/reviews"
              element={
                <ProtectedRoute allowedRoles={['guardian']}>
                  <GuardianReviewsPage />
                </ProtectedRoute>
              }
            />

            {/* Tutor Routes (auth required, tutor role) */}
            <Route
              path="/tutor/apply"
              element={
                <ProtectedRoute allowedRoles={['tutor']}>
                  <TutorApplyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['tutor']}>
                  <TutorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor/browse-requests"
              element={
                <ProtectedRoute allowedRoles={['tutor']}>
                  <TutorBrowseRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor/profile"
              element={
                <ProtectedRoute allowedRoles={['tutor']}>
                  <TutorProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (auth required, admin role) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminVerificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ad-verifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAdVerificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/matches"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminMatchesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/donations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDonationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAdminsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
