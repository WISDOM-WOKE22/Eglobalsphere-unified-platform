import { useStoreTypes } from "@/types";
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
        }),
        {
            name: "store"
        }
    )
);