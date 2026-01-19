import { IUser } from "./user.types";
import { CompanyType, } from "./company.types";
import { Vehicle } from "./lpr.types";
import { SpherexEmployee, SpherexVisitor } from "./spherex.types";

export interface useStoreTypes {
    isAuthenticated: boolean;
    setIsAuthenticated: (authenticated: boolean) => void;
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
    company: CompanyType | null;
    setCompany: (company: CompanyType) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    selectedVehicle: Vehicle | null;
    setSelectedVehicle: (vehicle: Vehicle) => void;
    spherexEmployee: SpherexEmployee | null;
    setSpherexEmployee: (employee: SpherexEmployee) => void;
    spherexVisitor: SpherexVisitor | null;
    setSpherexVisitor: (visitor: SpherexVisitor | null) => void;
}