import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContextType, ServiceType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayUsername, setDisplayUsername] = useState("");
  const [pendingUsernameChange, setPendingUsernameChange] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.info("Auth state changed:", event, session ? "SESSION" : "NO SESSION");
        
        if (event === 'PASSWORD_RECOVERY') {
          navigate('/password-reset');
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setCurrentService(null);
          setIsAdmin(false);
          navigate('/login');
        } else if (event === 'USER_UPDATED') {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session) {
            setIsAuthenticated(true);
            const serviceMetadata = session.user?.user_metadata?.service as ServiceType;
            setCurrentService(serviceMetadata || null);
            setIsAdmin(serviceMetadata === 'crunchyroll');
            
            const username = session.user?.email || session.user?.user_metadata?.username || "";
            const displayUsername = username.includes('@') ? username.split('@')[0] : username;
            setDisplayUsername(displayUsername);
          }
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session) {
          setIsAuthenticated(true);
          const serviceMetadata = session.user?.user_metadata?.service as ServiceType;
          setCurrentService(serviceMetadata || null);
          setIsAdmin(serviceMetadata === 'crunchyroll');
          
          const username = session.user?.email || session.user?.user_metadata?.username || "";
          const displayUsername = username.includes('@') ? username.split('@')[0] : username;
          setDisplayUsername(displayUsername);
        } else {
          setIsAuthenticated(false);
          setCurrentService(null);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.info("Initial auth check:", session ? "Session found" : "No session found");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        setIsAuthenticated(true);
        const serviceMetadata = session.user?.user_metadata?.service as ServiceType;
        setCurrentService(serviceMetadata || null);
        setIsAdmin(serviceMetadata === 'crunchyroll');
        
        const username = session.user?.email || session.user?.user_metadata?.username || "";
        const displayUsername = username.includes('@') ? username.split('@')[0] : username;
        setDisplayUsername(displayUsername);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (username: string, password: string, service: ServiceType) => {
    try {
      const email = username.includes('@') ? username : `${username}@gmail.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user?.user_metadata?.service !== service) {
        await supabase.auth.signOut();
        toast.error(`You are not authorized to access the ${service} dashboard`);
        return;
      }

      toast.success(`Logged in to ${service} dashboard successfully!`);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    }
  };

  const signup = async (username: string, password: string, token: string, service: ServiceType) => {
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from('tokens')
        .select('*')
        .eq('token', token)
        .eq('service', service)
        .eq('used', false)
        .single();

      if (tokenError || !tokenData) {
        toast.error("Invalid or expired token");
        return;
      }

      const email = username.includes('@') ? username : `${username}@gmail.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            service
          }
        }
      });

      if (error) {
        throw error;
      }

      await supabase
        .from('tokens')
        .update({ used: true })
        .eq('id', tokenData.id);

      toast.success(`Signed up to ${service} dashboard successfully!`);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to signup");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
    }
  };

  const generateToken = async (service: ServiceType): Promise<string | null> => {
    try {
      if (currentService !== 'crunchyroll') {
        toast.error("Only Crunchyroll admin can generate tokens");
        return null;
      }

      const token = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { error } = await supabase
        .from('tokens')
        .insert([{ 
          token, 
          service,
          used: false,
          created_by: user?.id || null
        }]);

      if (error) {
        console.error("Token generation error:", error);
        toast.error(`Failed to generate token: ${error.message}`);
        return null;
      }

      toast.success(`Generated token for ${service}`);
      return token;
    } catch (error: any) {
      console.error("Token generation error:", error);
      toast.error(error.message || "Failed to generate token");
      return null;
    }
  };

  const updateUsername = async (newUsername: string): Promise<void> => {
    try {
      const email = newUsername.includes('@') ? newUsername : `${newUsername}@gmail.com`;
      
      setPendingUsernameChange(newUsername);
      
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        setPendingUsernameChange(null);
        throw error;
      }

      toast.success("Please check your email to confirm your username change.");
    } catch (error: any) {
      console.error("Update username error:", error);
      toast.error(error.message || "Failed to update username");
    }
  };

  const updatePassword = async (newPassword: string): Promise<{error?: any}> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully");
      
      await supabase.auth.signOut({ scope: 'global' });
      
      navigate('/login');
      
      toast.info("Logged out from all devices for security");
      return {};
    } catch (error: any) {
      console.error("Update password error:", error);
      toast.error(error.message || "Failed to update password");
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    currentService,
    isAdmin,
    displayUsername,
    pendingUsernameChange,
    login,
    signup,
    logout,
    generateToken,
    updateUsername,
    updatePassword,
    setSession,
    setUser,
    setIsAuthenticated,
    setCurrentService,
    setIsAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
