/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/core/services/api';
import { useState } from 'react';
import {
  UserPreferenceFormData,
  userPreferenceSchema,
  UserSecurityFormData,
  userSecuritySchema,
} from '../schema/settings';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useSettingService = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [settingLoading, setSettingLoading] = useState(false);

  const updateForm = useForm<UserPreferenceFormData>({
    resolver: zodResolver(userPreferenceSchema),
  });

  const securityForm = useForm<UserSecurityFormData>({
    resolver: zodResolver(userSecuritySchema),
  });

  const updatePreference = async (data: FormData) => {
    console.log("hmmm")
  };

  const toggleTwoFactor = async () => {
    console.log("hh")
  };

  const updateSecurity = async (data: UserSecurityFormData) => {
    try {
      let res;
      console.log("hello")
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Could not create';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const updatePassword = async (data: UserSecurityFormData) => {
    try {

        const res = await api.patch('/settings/security', data);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Could not create';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    updatePreference,
    serverError,
    updateSecurity,
    updateForm,
    securityForm,
    toggleTwoFactor,
    settingLoading,
  };
};
