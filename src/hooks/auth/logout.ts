import api from '@/core/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore as useMainStore } from '@/lib/zustand/store';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { clearAuthCookies } from '@/lib/auth-utils';

export const useLogoutService = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const logoutUser = useMainStore((state) => state.logout);

    const handleLogout = () => {
        // Clear Zustand store
        logoutUser();
        
        // Clear auth cookies
        clearAuthCookies();
        
        // Redirect to login
        router.push('/login');
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/logout');
            handleLogout();
            toast.success(response.data.message || 'Logged out successfully');
        } catch (error) {
            const errorMessage = error instanceof AxiosError && error.response?.data?.message
                ? error.response.data.message
                : 'An error occurred during logout';
            setServerError(errorMessage);
            
            // Still log out locally even if API call fails
            handleLogout();
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading, serverError };
};