import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqLogsResponse } from "@/types";

export const useFarouqLogsService = () => {
  const { data, error, isLoading } = useSWR<FarouqLogsResponse>('/fms/logs', fetcher);

  return { data, error, isLoading };
};