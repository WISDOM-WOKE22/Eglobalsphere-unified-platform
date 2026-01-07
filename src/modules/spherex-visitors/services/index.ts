import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexVisitorsResponse } from "@/types";

export const useSpherexVisitorsService = () => {
  const { data, error, isLoading } = useSWR<SpherexVisitorsResponse>('/spherex/visitors', fetcher);

  return { data, error, isLoading };
};