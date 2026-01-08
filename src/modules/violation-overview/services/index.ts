import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ViolationOverviewResponse } from "@/types";

export const useViolationOverviewService = () => {
  const { data, error, isLoading } = useSWR<ViolationOverviewResponse>('/vehicle-violations/overview', fetcher);

  return { data, error, isLoading };
};