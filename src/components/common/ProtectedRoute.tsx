// src/components/common/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "./Spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner text="Vérification de la session..." />;
  if (!user) return <Navigate to="/signin" replace />;

  return <>{children}</>;
}