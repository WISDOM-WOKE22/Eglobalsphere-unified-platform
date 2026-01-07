/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function useTwoFactor() {
  const [serverError, setServerError] = useState('');
  const searchParams = useSearchParams();
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const query = searchParams.get('token');
  const router = useRouter();
  const setUser = useStore(state => state.setUser);
  const setToken = useStore(state => state.setToken);
  const setCompany = useStore(state => state.setCompany);

  const setRefreshToken = useStore(state => state.setRefreshToken);
  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const twoFactor = async (data: TwoFactorFormData) => {
    setServerError('');
    try {
      const res = await api.post(`/auth/login-2fa/${query}`, data);
      if (res.status === 200) {
        setUser(res.data.doc.user);
        setToken(res.data.doc.token);
        setRefreshToken(res.data.doc.refreshToken);
        setCompany(res.data.doc.preferences);
        document.cookie = `auth-token=${res.data.doc.token}; path=/; SameSite=Strict`;
        document.cookie = `refresh-token=${res.data.doc.refreshToken}; path=/; SameSite=Strict`;
        toast.success('Logged in Successfully');
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'Failed to complete login';
      setServerError(errorMessage);
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
