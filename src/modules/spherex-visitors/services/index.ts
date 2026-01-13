import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexVisitorsResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useSpherexVisitorsService = (queryParams: Record<string, any> = {}) => {
  const queryString = toQueryString(queryParams);
  
  const { data, error, isLoading } = useSWR<SpherexVisitorsResponse>(
    `/spherex/visitors?${queryString}`, 
    fetcher
  );

  return { data, error, isLoading };
};