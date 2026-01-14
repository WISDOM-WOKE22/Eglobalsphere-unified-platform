import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ViolationLogsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useViolationLogsService = (queryParams: Record<string, any> = {}) => {
  const queryString = toQueryString(queryParams);
  
  const { data, error, isLoading } = useSWR<ViolationLogsResponse>(
    `/vehicle-violations/violations?${queryString}`, 
    fetcher
  );

  return { data, error, isLoading };
};