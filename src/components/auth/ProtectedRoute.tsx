
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredService?: "crunchyroll" | "netflix" | "prime";
}

export const ProtectedRoute = ({ children, requiredService }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Basic protection - user must be logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Optional service-specific authorization can be implemented here
  // For example, checking if the user has access to the specific service
  // This is a placeholder - you would typically check this with your backend
  
  return <>{children}</>;
};
