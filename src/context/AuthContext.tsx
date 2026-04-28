// ════════════════════════════════════════════════════════════
//  src/context/AuthContext.tsx
//  À créer dans ton projet React TailAdmin
// ════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, isAuthenticated } from "../services/api";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  bio?: string;
  photo_profil?: string;
  solde_wallet: number;
  role: "user" | "admin";
  email_verifie: boolean;
}

interface Stats {
  challenges_crees: number;
  participations: number;
  victoires: number;
  total_gains: number;
}

interface AuthContextType {
  user: User | null;
  stats: Stats | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage si un token existe
  useEffect(() => {
    if (isAuthenticated()) {
      authApi.me()
        .then((data) => { setUser(data.user); setStats(data.stats); })
        .catch(() => { localStorage.removeItem("challengehub_token"); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    // Charger les stats
    const me = await authApi.me();
    setStats(me.stats);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setStats(null);
  };

  const refreshUser = async () => {
    const me = await authApi.me();
    setUser(me.user);
    setStats(me.stats);
  };

  return (
    <AuthContext.Provider value={{ user, stats, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
