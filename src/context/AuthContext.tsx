
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  signInService, 
  getServiceData, 
  setServiceData, 
  ServiceType 
} from "@/lib/firebaseService";

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string, service: ServiceType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  currentService: ServiceType | null;
  generateToken: (service: "netflix" | "prime") => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
  currentService: null,
  generateToken: async () => "",
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current service from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("crunchyroll")) {
      setCurrentService("crunchyroll");
    } else if (path.includes("netflix")) {
      setCurrentService("netflix");
    } else if (path.includes("prime")) {
      setCurrentService("prime");
    } else {
      setCurrentService(null);
    }
  }, [location]);

  // Initialize auth state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedService = localStorage.getItem("service") as ServiceType | null;
    
    if (storedUser && storedService) {
      setUser(JSON.parse(storedUser));
      setCurrentService(storedService);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, service: ServiceType) => {
    setIsLoading(true);
    
    try {
      const userCredential = await signInService(service, email, password);
      
      // Generate user object with required information
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
      };
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("service", service);
      
      setUser(userData);
      setCurrentService(service);
      
      // Redirect to the appropriate admin page
      navigate(`/${service}`);
      
      toast.success(`Logged in successfully as ${email}`);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to log in";
      
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("service");
    setUser(null);
    setCurrentService(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const generateToken = async (service: "netflix" | "prime"): Promise<string> => {
    try {
      // Generate a random token
      const randomToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Get existing tokens or create new tokens object
      const existingTokens = await getServiceData(service, "/tokens") || {};
      
      // Add new token with expiry date (7 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      const newToken = {
        token: randomToken,
        created: new Date().toISOString(),
        expires: expiryDate.toISOString(),
        used: false
      };
      
      // Add to tokens collection
      await setServiceData(service, `/tokens/${randomToken}`, newToken);
      
      return randomToken;
    } catch (error) {
      console.error("Error generating token:", error);
      toast.error("Failed to generate token");
      return "";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, currentService, generateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
