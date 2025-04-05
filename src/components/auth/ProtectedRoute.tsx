
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { ServiceType } from "@/lib/firebaseService";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredService: ServiceType;
}

export function ProtectedRoute({ children, requiredService }: ProtectedRouteProps) {
  const { user, isLoading, currentService } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to correct service page if authenticated but trying to access a different service
  if (currentService !== requiredService) {
    return <Navigate to={`/${currentService}`} replace />;
  }

  return <>{children}</>;
}
