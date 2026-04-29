// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, isAuthenticated } from "../services/api";

interface User {
  id: number; nom: string; prenom: string; email: string;
  bio?: string; photo_profil?: string;
  solde_wallet: number; role: "user" | "admin"; email_verifie: boolean;
}

interface Stats {
  challenges_crees: number; participations: number;
  victoires: number; total_gains: number;
}

interface AuthContextType {
  user: User | null; stats: Stats | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      authApi.me()
        .then((d) => { setUser(d.user); setStats(d.stats); })
        .catch(() => localStorage.removeItem("ch_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login(email, password);
    const d = await authApi.me();
    setUser(d.user); setStats(d.stats);
  };

  const register = async (p: any) => {
    await authApi.register(p);
    const d = await authApi.me();
    setUser(d.user); setStats(d.stats);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null); setStats(null);
  };

  const refreshUser = async () => {
    const d = await authApi.me();
    setUser(d.user); setStats(d.stats);
  };

  return (
    <AuthContext.Provider value={{ user, stats, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être dans AuthProvider");
  return ctx;
}
