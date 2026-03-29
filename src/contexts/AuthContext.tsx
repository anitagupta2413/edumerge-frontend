import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "VIEWER";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isViewer: boolean;
  canWrite: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth initialization failed", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = user?.role === "ADMIN";
  const isStaff = user?.role === "STAFF";
  const isViewer = user?.role === "VIEWER";

  const canWrite = (module: string) => {
    if (isAdmin) return true;
    if (isViewer) return false;
    
    // Staff permissions
    const staffModules = ["applicants", "seat-allocation", "admissions"];
    if (isStaff && staffModules.includes(module.toLowerCase())) {
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStaff, isViewer, canWrite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
