/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/core/services/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, LoginFormData } from '../schema/loginSchema';

export function useLogin() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const login = async (data: LoginFormData) => {
    setServerError('');

    try {
      const res = await api.post('/auth/login', data);

      if (res.data.message === '2FA required') {
        router.push(`/2fa?token=${res.data.doc.token}`);
        return;
      } else if (res.data.message === 'Email verification required') {
        router.push(`/verify-otp?token=${res.data.doc.token}`);
        return;
      }

      // Calculate expiry for 7 days from now
      const expires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toUTCString();
      // if (user.role === 'USER' || user.role === 'user') {
      //   router.push('/my-dashboard');
      // } else if (
      //   user.role === 'ADMIN' ||
      //   user.role === 'SUB_ADMIN' ||
      //   user.role === 'admin'
      // ) {
      // }
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 406) {
        router.push(`/verify-otp?token=${err.response.data.doc.token}`);
      } else {
        const errorMessage =
          err.response?.data?.detail || err.message || 'Login failed';
        setServerError(errorMessage);
      }
    }
  };

  return {
    form,
    login,
    serverError,
  };
}
