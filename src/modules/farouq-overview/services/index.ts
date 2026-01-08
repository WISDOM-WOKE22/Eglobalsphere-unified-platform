import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqOverviewResponse } from "@/types";

export const useFarouqOverviewService = () => {
  const { data, error, isLoading } = useSWR<FarouqOverviewResponse>('/fms/overview', fetcher);

  return { data, error, isLoading };
};