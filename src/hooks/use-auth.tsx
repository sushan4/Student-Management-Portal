import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authAPI, TokenManager, LoginRequest, ApiError } from '@/services/api';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = TokenManager.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setUsername(null);
        return;
      }

      if (TokenManager.isAuthenticated()) {
        // Extract username from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUsername(payload.sub || payload.name || 'User');
          setIsAuthenticated(true);
        } catch {
          // Token is malformed
          TokenManager.removeToken();
          setIsAuthenticated(false);
          setUsername(null);
        }
      } else {
        // Token is expired
        TokenManager.removeToken();
        setIsAuthenticated(false);
        setUsername(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      TokenManager.setToken(response.token);
      setUsername(response.username);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${response.username}!`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to inform server (optional)
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      TokenManager.removeToken();
      setIsAuthenticated(false);
      setUsername(null);
      toast.success('Logged out successfully');
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value: AuthContextType = {
    isAuthenticated,
    username,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
