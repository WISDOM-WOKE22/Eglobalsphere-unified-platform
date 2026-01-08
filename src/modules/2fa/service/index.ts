'use client';

import api from '@/core/services/api';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TwoFactorFormData, twoFactorSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/zustand/store';
import { setAuthCookies } from '@/lib/auth-utils';

export function useTwoFactor() {
  const [serverError, setServerError] = useState('');
  const searchParams = useSearchParams();
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const query = searchParams.get('token');
  const router = useRouter();
  
  // Zustand store actions
  const setUser = useStore((state) => state.setUser);
  const setToken = useStore((state) => state.setToken);
  const setRefreshToken = useStore((state) => state.setRefreshToken);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setCompany = useStore((state) => state.setCompany);

  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const twoFactor = async (data: TwoFactorFormData) => {
    setServerError('');
    try {
      const res = await api.post(`/auth/login-2fa/${query}`, data);
      
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

        toast.success('Logged in successfully');
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Failed to complete login';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resendTwoFactorCode = async () => {
    setServerError('');
    setResendLoading(true);
    try {
      const res = await api.post(`/auth/resend-2fa-code/${query}`);
      if (res.status === 200) {
        setResendLoading(false);
        toast.success('Two factor authentication code sent successfully');
      }
    } catch (err: any) {
      setResendLoading(false);
      const errorMessage =
        err.response?.data?.detail || err.message || 'Failed to send code';
      setServerError(errorMessage);
    }
  };

  return {
    form,
    twoFactor,
    serverError,
    resendTwoFactorCode,
    resendLoading,
  };
}
