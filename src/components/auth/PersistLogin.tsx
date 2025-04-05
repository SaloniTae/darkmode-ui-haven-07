
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * This component checks for a persisted login session before rendering the protected routes.
 * It acts as a wrapper around the protected routes that require authentication.
 */
export default function PersistLogin() {
  const { user, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Once the auth state is no longer loading, mark checking as complete
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading your session...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
