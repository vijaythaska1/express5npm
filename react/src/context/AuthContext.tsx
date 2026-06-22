import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    setLoading(false);
  }, []);

  const login = useCallback(
    (t: string) => {
      localStorage.setItem("token", t);
      setToken(t);
      navigate("/dashboard");
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ["/", "/register"];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    if (!token && !isPublicRoute) {
      navigate("/");
    } else if (token && isPublicRoute) {
      navigate("/dashboard");
    }
  }, [token, loading, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
