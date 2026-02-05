// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Navbar from "./components/landing/navbar";
// import Footer from "./components/landing/footer";
// import UpdateProfile from "./components/pages/updateProfile";
// import MyProfile from "./components/pages/myProfile";
// import Home from "./components/pages/home";
// import Login from "./components/pages/authpage";
// import AdminDashboard from "./components/pages/adminDashboard";
// import EventPage from "./components/pages/EventPage";
// import VolunteerDashboard from "./components/pages/volunteer";



// // Protected Route wrapper
// function ProtectedRoute({ children, isAuthenticated }) {
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// // AdminRoute wrapper for admin-only access
// function AdminRoute({ children, isAuthenticated }) {

//   const user = JSON.parse(localStorage.getItem("user"));
//   const isAdmin = user && user.role === "admin";
//   return isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;
// }

// export default function App() {
//   // ✅ Initialize from localStorage
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return !!(user && user.id);
//   });

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem("user");
//   };

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar
//           isAuthenticated={isAuthenticated}
//           onLogout={handleLogout}
//           showMessage={true}
//         />

//         <main className="flex-grow ">
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 isAuthenticated &&
//                 JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (
//                   <Navigate to="/adminDashboard" replace />
//                 ) : (
//                   <Home />
//                 )
//               }
//             />
//             <Route
//               path="/adminDashboard"
//               element={
//                 <AdminRoute isAuthenticated={isAuthenticated}>
//                   <AdminDashboard />
//                 </AdminRoute>
//               }
//             />
//             {/* Protect /updateProfile route */}
//             <Route
//               path="/updateProfile"
//               element={
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <UpdateProfile />
//                 </ProtectedRoute>
//               }
//             />
//             {/* Protect /myProfile route */}
//             <Route
//               path="/myProfile"
//               element={
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <MyProfile />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/login"
//               element={
//                 !isAuthenticated ? (
//                   <Login onLogin={handleLogin} />
//                 ) : (
//                   <Navigate to="/" replace />
//                 )
//               }
//             />

//             <Route path="/api/view/events/:id" element={<EventPage />} />
//             <Route path="/api/volunteer" element={<VolunteerDashboard />} />

//             {/* Catch-all redirect */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>

//         <Footer />
//       </div>
//     </Router>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import Navbar from "./components/landing/navbar";
// import Footer from "./components/landing/footer";
// import UpdateProfile from "./components/pages/updateProfile";
// import MyProfile from "./components/pages/myProfile";
// import Home from "./components/pages/home";
// import Login from "./components/pages/authpage";
// import AdminDashboard from "./components/pages/adminDashboard";
// import EventPage from "./components/pages/EventPage";
// import VolunteerDashboard from "./components/pages/volunteer";
// const BaseUrl = import.meta.env.VITE_BASEURL;



// // ✅ Protected Route
// function ProtectedRoute({ children, isAuthenticated }) {
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// // ✅ Admin Route
// function AdminRoute({ children, user }) {
//   return user?.role === "admin" ? children : <Navigate to="/" replace />;
// }

// export default function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔥 check auth from cookie
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(`${BaseUrl}/api/auth/verify`, {
//           credentials: "include",
//         });

//         console.log(res)

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data.user);
//           setIsAuthenticated(true);
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       } catch {
//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const handleLogin = () => {
//     setIsAuthenticated(true);
//   };

//   const handleLogout = async () => {
//     await fetch("/auth/logout", {
//       method: "POST",
//       credentials: "include",
//     });

//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar
//           isAuthenticated={isAuthenticated}
//           onLogout={handleLogout}
//           showMessage={true}
//         />

//         <main className="flex-grow ">
//           <Routes>

//             <Route
//               path="/"
//               element={
//                 user?.role === "admin" ? (
//                   <Navigate to="/adminDashboard" replace />
//                 ) : (
//                   <Home />
//                 )
//               }
//             />

//             <Route
//               path="/adminDashboard"
//               element={
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <AdminRoute user={user}>
//                     <AdminDashboard />
//                   </AdminRoute>
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/updateProfile"
//               element={
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <UpdateProfile />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/myProfile"
//               element={
//                 <ProtectedRoute isAuthenticated={isAuthenticated}>
//                   <MyProfile />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/login"
//               element={
//                 !isAuthenticated ? (
//                   <Login onLogin={handleLogin} />
//                 ) : (
//                   <Navigate to="/" replace />
//                 )
//               }
//             />

//             <Route path="/api/view/events/:id" element={<EventPage />} />
//             <Route path="/api/volunteer" element={<VolunteerDashboard />} />

//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>

//         <Footer />
//       </div>
//     </Router>
//   );
// }


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
                !isAuthenticated ? (
                  <Login />
                ) : (
                  <Navigate to="/" replace />
                )
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
