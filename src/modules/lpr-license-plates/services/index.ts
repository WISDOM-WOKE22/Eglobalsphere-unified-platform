import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRLicensePlatesResponse } from "@/types";
import { toQueryString } from "@/lib/utils";
import api from "@/core/services/api";
import { toast } from "sonner";

export const useLPRLicensePlatesService = (queryParams: Record<string, any> = {}) => {
  // Ensure default pagination parameters are always included
  const params: Record<string, any> = {
    page: queryParams.page ?? 1,
    limit: queryParams.limit ?? 20,
  };
  
  // Add search if provided
  if (queryParams.search) {
    params.search = queryParams.search;
  }
  
  const queryString = toQueryString(params);
  const url = `/lpr/vehicles?${queryString}`;
  
  const { data, error, isLoading } = useSWR<LPRLicensePlatesResponse>(
    url, 
    fetcher
  );

  const fetchVehiclesForExport = async (queryParams: Record<string, any> = {}) => {
    const params: Record<string, any> = {
      page: 1,
      limit: 100,
    };
    if (queryParams.search) {
      params.search = queryParams.search;
    }
    const queryString = toQueryString(params);
    const url = `/lpr/vehicles?${queryString}`;
    const response = await api.get(url);
    const vehicles = response?.data?.vehicles ?? response?.data?.data?.vehicles ?? [];
    return Array.isArray(vehicles) ? vehicles : [];
  };

  const exportLPRLicensePlates = async (queryParams: Record<string, any> = {}) => {
    try {
      const vehicles = await fetchVehiclesForExport(queryParams);
      return vehicles;
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to fetch data for export');
      return [];
    }
  };

  return { data, error, isLoading, exportLPRLicensePlates };
};