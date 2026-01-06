import { useStoreTypes } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "@/types/user.types";

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
                    refreshToken: null,
                }),
            token: null,
            setToken: (token: string) => set({ token }),
            refreshToken: null,
            setRefreshToken: (refreshToken: string) => set({ refreshToken }),
        }),
        {
            name: "store"
        }
    )
);