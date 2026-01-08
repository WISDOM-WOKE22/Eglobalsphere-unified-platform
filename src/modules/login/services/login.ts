/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/core/services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, LoginFormData } from '../schema/loginSchema';
import { useStore } from '@/lib/zustand/store';
import { setAuthCookies } from '@/lib/auth-utils';
import { toast } from 'sonner';

export function useLogin() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  
  // Zustand store actions
  const setUser = useStore((state) => state.setUser);
  const setToken = useStore((state) => state.setToken);
  const setRefreshToken = useStore((state) => state.setRefreshToken);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setCompany = useStore((state) => state.setCompany);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const login = async (data: LoginFormData) => {
    setServerError('');

    try {
      const res = await api.post('/auth/login', data);

      // Handle 2FA required
      if (res.data.message === '2FA required') {
        router.push(`/2fa?token=${res.data.doc.token}`);
        return;
      } 
      
      // Handle email verification required
      if (res.data.message === 'Email verification required') {
        router.push(`/verify-otp?token=${res.data.doc.token}`);
        return;
      }

      // Successful login - set auth state
      if (res.status === 200 && res.data.doc) {
        const { user, token, refreshToken, preferences } = res.data.doc;

        // Set cookies
        setAuthCookies(
          { token, refreshToken },
          { role: user.role }
        );

        // Update Zustand store
        setUser(user);
        setToken(token);
        setRefreshToken(refreshToken);
        setIsAuthenticated(true);
        
        if (preferences) {
          setCompany(preferences);
        }

        toast.success('Login successful');
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.status === 406) {
        // Email verification required
        router.push(`/verify-otp?token=${err.response.data.doc.token}`);
      } else {
        const errorMessage =
          err.response?.data?.detail || 
          err.response?.data?.message || 
          err.message || 
          'Login failed';
        setServerError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return {
    form,
    login,
    serverError,
  };
}
