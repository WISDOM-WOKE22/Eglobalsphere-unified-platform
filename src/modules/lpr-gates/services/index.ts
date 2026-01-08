import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRGatesResponse } from "@/types";

export const useLPRGatesService = () => {
  const { data, error, isLoading } = useSWR<LPRGatesResponse>('/lpr/gates', fetcher);

  return { data, error, isLoading };
};