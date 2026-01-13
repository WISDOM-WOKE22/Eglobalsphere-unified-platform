import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexLogsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useSpherexLogsService = (queryParams: Record<string, any> = {}) => {
  const queryString = toQueryString(queryParams);
  
  const { data, error, isLoading } = useSWR<SpherexLogsResponse>(
    `/spherex/logs?${queryString}`, 
    fetcher
  );

  return { data, error, isLoading };
};