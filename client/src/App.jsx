import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/landing/navbar";
import Footer from "./components/landing/footer";

import UpdateProfile from "./components/pages/updateProfile";
import MyProfile from "./components/pages/myProfile";
import Home from "./components/pages/home";
import Login from "./components/pages/authpage";
import AdminDashboard from "./components/pages/adminDashboard";
import EventPage from "./components/pages/EventPage";
import VolunteerDashboard from "./components/pages/volunteer";
import ScanPage from "./components/pages/ScanPage";

import { useAuth } from "./context/AuthContext";

// ✅ Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ✅ Admin Route
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user?.role === "admin" ? children : <Navigate to="/" replace />;
}

function VolunteerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user?.role !== "student" ? children : <Navigate to="/" replace />;
}

export default function App() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar now gets data directly from context */}
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={logout}
          showMessage={true}
        />

        <main className="flex-grow">
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                user?.role === "admin" ? (
                  <Navigate to="/adminDashboard" replace />
                ) : (
                  <Home />
                )
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/" replace />
              }
            />

            {/* Admin */}
            <Route
              path="/adminDashboard"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* Profile */}
            <Route
              path="/updateProfile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/myProfile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <VolunteerRoute>
                    <ScanPage />
                  </VolunteerRoute>
                </ProtectedRoute>
              }
            />

            {/* Public */}
            <Route path="/api/view/events/:id" element={<EventPage />} />
            <Route path="/api/volunteer" element={<VolunteerDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
