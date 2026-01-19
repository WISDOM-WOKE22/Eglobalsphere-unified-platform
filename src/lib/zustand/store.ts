import { CompanyType, useStoreTypes, IUser, Vehicle, SpherexEmployee, SpherexVisitor } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<useStoreTypes>()(
    persist(
        (set) => ({
            isLicensePlatesOpen: false,
            setIsLicensePlatesOpen: (open: boolean) => set({ isLicensePlatesOpen: open }),
            isNotificationOpen: false,
            setIsNotificationOpen: (open: boolean) => set({ isNotificationOpen: open }),
            isLPRGateOpen: false,
            setIsLPRGateOpen: (open: boolean) => set({ isLPRGateOpen: open }),
            user: null,
            setUser: (user: IUser) => set({ user }),
            logout: () =>
                set({
                    user: null,
                    isLicensePlatesOpen: false,
                    isNotificationOpen: false,
                    isLPRGateOpen: false,
                    token: null,
                    company: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false
                }),
            token: null,
            setToken: (token: string) => set({ token }),
            refreshToken: null,
            setRefreshToken: (refreshToken: string) => set({ refreshToken }),
            company: null,
            setCompany: (company: CompanyType) => set({ company }),
            isAuthenticated: false,
            setIsAuthenticated: (authenticated: boolean) => set({ isAuthenticated: authenticated }),
            isLoading: false,
            setIsLoading: (loading: boolean) => set({ isLoading: loading }),
            selectedVehicle: null,
            setSelectedVehicle: (vehicle: Vehicle) => set({ selectedVehicle: vehicle }),
            spherexEmployee: null,
            setSpherexEmployee: (employee: SpherexEmployee) => set({ spherexEmployee: employee }),
            spherexVisitor: null,
            setSpherexVisitor: (visitor: SpherexVisitor | null) => set({ spherexVisitor: visitor ?? null }),
        }),
        {
            name: "store"
        }
    )
);