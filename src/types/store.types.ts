import { IUser } from "./user.types";

export interface useStoreTypes {
    isLicensePlatesOpen: boolean;
    setIsLicensePlatesOpen: (open: boolean) => void;
    isNotificationOpen: boolean;
    setIsNotificationOpen: (open: boolean) => void;
    isLPRGateOpen: boolean;
    setIsLPRGateOpen: (open: boolean) => void;
    user: IUser | null;
    setUser: (user: IUser) => void;
    logout: () => void;
    token: string | null;
    setToken: (token: string) => void;
    refreshToken: string | null;
    setRefreshToken: (refreshToken: string) => void;
}