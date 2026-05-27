import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { apiFetch, getStoredToken, parseJsonError, setStoredToken } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "vendor";
}

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: User["role"],
    cityId?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setReady(true);
      return;
    }
    (async () => {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const data = (await res.json()) as { user: User };
        setUser(data.user);
      } else {
        setStoredToken(null);
      }
      setReady(true);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await parseJsonError(res));
    const data = (await res.json()) as { user: User; token: string };
    setStoredToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: User["role"],
      cityId?: string
    ) => {
      const body: Record<string, string> = { name, email, password, role };
      if (cityId) body.cityId = cityId;
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await parseJsonError(res));
      const data = (await res.json()) as { user: User; token: string };
      setStoredToken(data.token);
      setUser(data.user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      /* ignore network errors on logout */
    }
    setStoredToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
      isVendor: user?.role === "vendor",
    }),
    [user, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
