import React, { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "vendor";
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: User["role"]) => boolean;
  logout: () => void;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    setUser({ id: "u1", name: email.split("@")[0], email, role: email.includes("vendor") ? "vendor" : "buyer" });
    return true;
  };

  const register = (name: string, email: string, _password: string, role: User["role"]) => {
    setUser({ id: "u" + Date.now(), name, email, role });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isVendor: user?.role === "vendor" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

