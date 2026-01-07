import api from "@/core/services/api";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preferenceLogoSchema, preferenceSchema, PreferenceLogoFormData, preferenceSchemaType } from "../components/schemas";
import { useStore } from "@/lib/zustand/store";

export const useCustomizationService = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { setCompany } = useStore();
    
    const preferenceForm = useForm<preferenceSchemaType>({
        resolver: zodResolver(preferenceSchema),
    });

    const preferenceLogoForm = useForm<PreferenceLogoFormData>({
        resolver: zodResolver(preferenceLogoSchema),
    });

    const updatePreference = async (data: preferenceSchemaType) => {
        try {
            const res = await api.put('/preferences', data);
            if (res.status === 200) {
                toast.success(res.data.message);
                setCompany(res.data)
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.detail ||
                error.message ||
                'Could not update preference';

            toast.error(errorMessage);
            setServerError(errorMessage);
        }
    }

    const updatePreferenceLogo = async (data: FormData) => {
        try {
            const res = await api.post('/preferences/upload-logo', data);
            if (res.status === 200) {
                toast.success(res.data.message);
                console.log(res.data)
                // setCompany(res.data)
            }
        }
        catch (error: any) {
            const errorMessage =
                error.message ||
                'Could not update preference logo';

            toast.error(errorMessage);
            setServerError(errorMessage);
        }
    }

    const getPreference = async () => {
        try {
            const res = await api.get('/preferences');
            if (res.status === 200) {
                setCompany(res.data)
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.detail ||
                error.message ||
                'Could not get preference';

            toast.error(errorMessage);
            setServerError(errorMessage);
        }
    }

    return {
        updatePreference,
        preferenceForm,
        preferenceLogoForm,
        serverError,
        updatePreferenceLogo,
        getPreference
    }
};