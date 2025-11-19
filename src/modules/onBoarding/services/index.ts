import api from '@/core/services/api';
import { useState } from 'react';
import {
  OrganizationSetupFormData,
  organizationSetupSchema,
  accountFormData,
  accountSchema,
  OrganizationDetailsSchema,
  OrganizationDetailsFormData,
} from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useOnboardingService = () => {
 
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const organizationForm = useForm<OrganizationSetupFormData>({
    resolver: zodResolver(organizationSetupSchema),
  });

  const accountSetupForm = useForm<accountFormData>({
    resolver: zodResolver(accountSchema),
  });

  const organizationDetailsForm = useForm<OrganizationDetailsFormData>({
    resolver: zodResolver(OrganizationDetailsSchema),
  });

  const setupOrganization = async (data: FormData) => {
    try {
      const res = await api.patch(`/organization`, data);
      if (res.status === 200) {
        toast.success(res.data.message);
        router.push(`/dashboard`);
      }
    } catch (error: any) {
      const errorMessage =
        (error?.response?.data?.message as string) ||
        (error?.message as string) ||
        'Could not complete organization setup';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const setupAccount = async (data: accountFormData) => {
    try {
      const res = await api.post('/auth/create-admin', data);
      if (res.status === 201) {
        const { user, token, refreshToken } = res.data.doc;
        const isProduction = process.env.NODE_ENV === 'production';
        const secureFlag = isProduction ? '; secure' : '';
  

        router.push(`/onboarding/details`);
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        
      }
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Account setup failed try again';
      setServerError(errorMessage);
    }
  };

  const setupOrganizationDetails = async (data: OrganizationDetailsFormData) => {
    try {
      const res = await api.patch(`/organization`, data);
      if (res.status === 200) {
        toast.success(res.data.message);
        router.push('/onboarding/org');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Could not complete organization setup';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const organizationDetails = async (data: OrganizationDetailsFormData) => {
    try {
      const res = await api.patch(`/organization`, data);
      if (res.status === 200) {
        toast.success(res.data.message);
        router.push('/onboarding/org');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Could not complete organization setup';
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    setupOrganization,
    organizationForm,
    serverError,
    accountSetupForm,
    setupAccount,
    organizationDetails,
    organizationDetailsForm,
  };
};
