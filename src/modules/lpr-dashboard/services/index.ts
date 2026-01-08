import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRDashboardResponse } from "@/types";

export const useLPRDashboardService = () => {
  const { data, error, isLoading } = useSWR<LPRDashboardResponse>('/lpr/overview', fetcher);

  return { data, error, isLoading };
};