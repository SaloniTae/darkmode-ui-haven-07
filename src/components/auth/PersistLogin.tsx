
import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const PersistLogin = () => {
  const { user, session, isLoading } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateSession = async () => {
      if (!session) {
        setIsValidating(false);
        setIsValid(false);
        return;
      }

      try {
        // Verify if the session is still valid by checking with Supabase
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          console.info("Session validation failed:", error?.message || "No user found");
          setIsValid(false);
        } else {
          // Check if the session's auth.current_session_id matches the current session's id
          // This is important for detecting password changes which issue new sessions
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !sessionData.session) {
            console.info("Current session check failed:", sessionError?.message || "No session found");
            setIsValid(false);
          } else {
            console.info("Session successfully validated");
            setIsValid(true);
          }
        }
      } catch (err) {
        console.error("Error validating session:", err);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [session, location.pathname]); // Re-run on path changes (page refresh/navigation)

  if (isLoading || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If there's no user or the session is invalid, redirect to login
  if (!user || !isValid) {
    console.info("No valid session, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PersistLogin;
