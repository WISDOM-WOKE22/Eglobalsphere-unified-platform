/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/core/services/api';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { VerifyOtpFormData, verifyOtpSchema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useStore } from '@/lib/zustand/store';
import { setAuthCookies } from '@/lib/auth-utils';

export function useVerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('token');
  const [serverError, setServerError] = useState('');
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  // Zustand store actions
  const setUser = useStore((state) => state.setUser);
  const setToken = useStore((state) => state.setToken);
  const setRefreshToken = useStore((state) => state.setRefreshToken);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setCompany = useStore((state) => state.setCompany);

  const form = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const verifyOtp = async (data: VerifyOtpFormData) => {
    setServerError('');
    try {
      const res = await api.post(`/auth/verify-email/${query}`, data);
      
      if (res.status === 200 && res.data.doc) {
        const { user, token, refreshToken, preferences } = res.data.doc;

        // Set cookies
        if (token && refreshToken) {
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
        }

        toast.success('Email verified successfully');
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message || 
        err.message || 
        'OTP verification failed';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const resendVerificationCode = async () => {
    setServerError('');
    setResendLoading(true);
    try {
      const res = await api.post(
        `/auth/resend-email-verification-code/${query}`
      );
      if (res.status === 200) {
        setResendLoading(false);
        toast.success('Verification code sent successfully');
      }
    } catch (err: any) {
      setResendLoading(false);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to send verification code';
      setServerError(errorMessage);
    }
  };

  return {
    form,
    verifyOtp,
    serverError,
    resendVerificationCode,
    resendLoading,
  };
}
