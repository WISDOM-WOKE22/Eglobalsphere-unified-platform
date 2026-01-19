import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRLicensePlatesResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

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

  return { data, error, isLoading };
};