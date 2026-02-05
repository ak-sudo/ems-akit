import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BaseUrl = import.meta.env.VITE_BASEURL;


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BaseUrl}/api/auth/verify`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    const res = await fetch("/auth/me", {
      credentials: "include",
    });
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook (super clean usage)
export const useAuth = () => useContext(AuthContext);
