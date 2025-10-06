import React, { createContext, useState, useEffect,  } from "react";
import type { ReactNode } from "react";


interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  token: string | null;
  setAuthData: (token: string | null, email: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  token: null,
  setAuthData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  const setAuthData = (newToken: string | null, email: string | null) => {
    if (newToken) localStorage.setItem("authToken", newToken);
    else localStorage.removeItem("authToken");

    setToken(newToken);
    setUserEmail(email);
    setIsAuthenticated(!!newToken);
  };

  // Verify token when app loads
  useEffect(() => {
    if (!token) return;
    fetch("https://sevenhills-backend.onrender.com/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email);
        } else {
          setAuthData(null, null);
        }
      })
      .catch(() => setAuthData(null, null));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, token, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
