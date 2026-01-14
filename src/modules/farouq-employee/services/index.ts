import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqEmployeeResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useFarouqEmployeeService = (queryParams: Record<string, any> = {}) => {
  const queryString = toQueryString(queryParams);
  
  const { data, error, isLoading } = useSWR<FarouqEmployeeResponse>(
    `/fms/employees?${queryString}`, 
    fetcher
  );

  return { data, error, isLoading };
};