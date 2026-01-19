import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRGatesResponse } from "@/types";
import { toQueryString } from "@/lib/utils";

export const useLPRGatesService = (queryParams: Record<string, any> = {}) => {
  // Ensure default pagination parameters are always included
  const params: Record<string, any> = {
    page: queryParams.page ?? 1,
    limit: queryParams.limit ?? 20,
  };
  
  // Add optional filters if provided
  if (queryParams.search) {
    params.search = queryParams.search;
  }
  if (queryParams.project_name) {
    params.project_name = queryParams.project_name;
  }
  if (queryParams.type) {
    params.type = queryParams.type;
  }
  if (queryParams.enabled !== undefined) {
    params.enabled = queryParams.enabled;
  }
  if (queryParams.agent_status) {
    params.agent_status = queryParams.agent_status;
  }
  
  const queryString = toQueryString(params);
  const url = `/lpr/gates?${queryString}`;
  
  const { data, error, isLoading } = useSWR<LPRGatesResponse>(
    url, 
    fetcher
  );

  return { data, error, isLoading };
};