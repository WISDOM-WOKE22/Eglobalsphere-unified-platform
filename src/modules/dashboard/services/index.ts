import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { MyDashboardOverviewResponse } from "@/types";

export const useDashboardService = () => {
  const { data, error, isLoading } = useSWR<MyDashboardOverviewResponse>('/dashboard/overview', fetcher);

  return { data, error, isLoading };
};
