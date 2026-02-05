import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ showMessage = true }) {
  const navigate = useNavigate();
  const {user, isAuthenticated, logout, login } = useAuth();

  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ Show login confirmation when token/user exists

  if (localStorage.getItem("isLoggedIn")) {
    setMessage("✅ Logged in successfully!");
    localStorage.removeItem("isLoggedIn");
  }

  // ✅ Auto-dismiss toast
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message, user]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    setMessage("👋 Logged out successfully!");
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="text-2xl font-extrabold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            EMS - AKIT
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <a
              href="/#home"
              className="text-gray-800 hover:text-blue-600 transition"
            >
              Home
            </a>
            <a
              href="/#about"
              className="text-gray-800 hover:text-blue-600 transition"
            >
              About Us
            </a>
            <a
              href="/#events"
              className="text-gray-800 hover:text-blue-600 transition"
            >
              Upcoming Events
            </a>
            <a
              href="/#gallery"
              className="text-gray-800 hover:text-blue-600 transition"
            >
              Gallery
            </a>

            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <img
                  src={user.dp}
                  alt="profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500 hover:scale-105 transition"
                  onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-xl rounded-xl py-2 animate-fadeIn">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/myProfile")}
                    >
                      My Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => navigate("/updateProfile")}
                    >
                      Update Details
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 animate-slideDown">
            <div className="flex flex-col items-end mr-10 relative gap-4 py-6 font-medium">
              <a href="/" className="text-gray-800 hover:text-blue-600">
                Home
              </a>
              <a href="/#about" className="text-gray-800 hover:text-blue-600">
                About Us
              </a>
              <a href="/#events" className="text-gray-800 hover:text-blue-600">
                Upcoming Events
              </a>
              <a href="/#gallery" className="text-gray-800 hover:text-blue-600">
                Gallery
              </a>

              {!isAuthenticated ? (
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Login
                </button>
              ) : (
                <div className="absolute left-5">
                  <img
                    src={user?.dp}
                    alt="profile"
                    className="w-10 h-10 top-0 rounded-full cursor-pointer border-2 border-blue-500 hover:scale-105 transition"
                    onClick={() => setShowMenu(!showMenu)}
                  />
                  {showMenu && (
                    <div className="absolute left-0 mt-3 w-48 bg-white shadow-xl rounded-xl py-2 animate-fadeIn">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => navigate("/myProfile")}
                      >
                        My Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => navigate("/updateProfile")}
                      >
                        Update Details
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Toast Notification */}
      {message && (
        <div
          className="fixed top-16 right-5 px-5 py-3 rounded-xl shadow-lg 
          bg-white/90 backdrop-blur-md border border-gray-200 
          text-gray-800 flex items-center gap-3 z-50 animate-slideIn"
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          0% { transform: translateX(120%); opacity: 0; }
          50% { transform: translateX(-10px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
