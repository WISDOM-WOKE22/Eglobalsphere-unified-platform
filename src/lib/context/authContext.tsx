'use client';

import { createContext, useEffect, useState } from 'react';
import { useStore } from '@/lib/zustand/store';
import { getAuthToken, isTokenExpired } from '@/lib/auth-utils';
import { useLogoutService } from '@/hooks/auth/logout';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useLogoutService();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Zustand store state
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const user = useStore((state) => state.user);
  const token = useStore((state) => state.token);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Check if we have an auth token in cookies
        const cookieToken = getAuthToken();
        
        if (!cookieToken) {
          // No token in cookies, user is not authenticated
          if (isAuthenticated) {
            // Clear stale authentication state
            logout();
          }
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(cookieToken)) {
          // Token is expired, the API interceptor will handle refresh
          // or redirect to login if refresh fails
          setIsLoading(false);
          return;
        }

        // We have a valid token
        // Verify that Zustand store has user data
        if (!user && cookieToken) {
          // Token exists but no user data in store
          // This can happen after a page refresh
          // The token refresh will happen automatically via API interceptor
          // when the first authenticated request is made
          setIsAuthenticated(true);
        } else if (user && cookieToken) {
          // Everything looks good
          setIsAuthenticated(true);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync authentication state when token changes
  useEffect(() => {
    if (token && user) {
      setIsAuthenticated(true);
    }
  }, [token, user, setIsAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
