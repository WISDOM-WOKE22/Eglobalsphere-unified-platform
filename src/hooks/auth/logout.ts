import api from '@/core/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore as useMainStore } from '@/lib/zustand/store';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useLogoutService = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const logoutUser = useMainStore(state => state.logout);

    const handleLogout = () => {
        logoutUser();
        router.push('/login');
            const cookiesToClear = [
                'role',
                'token',
            ];
            cookiesToClear.forEach((cookieName) => {
                document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; SameSite=Strict`;
            });
    }

    const logout = async () => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/logout');
            handleLogout();
            toast.success(response.data.message);
            setIsLoading(false)
        } catch (error) {
            const errorMessage = error instanceof AxiosError && error.response?.data?.message
                ? error.response.data.message
                : 'An error occurred during logout';
            setServerError(errorMessage);
            handleLogout();
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return { logout, isLoading, serverError };
}