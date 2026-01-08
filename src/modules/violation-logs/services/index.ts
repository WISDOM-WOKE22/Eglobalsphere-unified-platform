import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ViolationLogsResponse } from "@/types";

export const useViolationLogsService = () => {
  const { data, error, isLoading } = useSWR<ViolationLogsResponse>('/vehicle-violations/violations', fetcher);

  return { data, error, isLoading };
};