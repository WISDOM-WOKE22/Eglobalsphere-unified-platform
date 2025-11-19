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

export function useTwoFactor() {
  const [serverError, setServerError] = useState('');
  const searchParams = useSearchParams();
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const query = searchParams.get('token');
  const router = useRouter();


  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const twoFactor = async (data: TwoFactorFormData) => {
    setServerError('');
    try {
      const res = await api.post(`/auth/login-2fa/${query}`, data);
      if (res.status === 200) {
        toast.success('Logged in Successfully');
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
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
        err.response?.data?.message || err.message || 'Failed to send code';
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
