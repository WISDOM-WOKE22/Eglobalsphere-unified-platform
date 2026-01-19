import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqLogsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useFarouqLogsService = (queryParams: Record<string, any> = {}) => {
  // Ensure default pagination parameters are always included
  const params: Record<string, any> = {
    page: queryParams.page ?? 1,
    page_size: queryParams.page_size ?? 10,
  };
  
  // Add optional filters if provided
  if (queryParams.search) {
    params.search = queryParams.search;
  }
  
  const queryString = toQueryString(params);
  const url = `/fms/logs?${queryString}`;
  
  const { data, error, isLoading } = useSWR<FarouqLogsResponse>(
    url, 
    fetcher
  );

  return { data, error, isLoading };
};