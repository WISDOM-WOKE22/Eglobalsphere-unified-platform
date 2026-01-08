import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { LPRLicensePlatesResponse } from "@/types";

export const useLPRLicensePlatesService = () => {
  const { data, error, isLoading } = useSWR<LPRLicensePlatesResponse>('/lpr/vehicles', fetcher);

  return { data, error, isLoading };
};