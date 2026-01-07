import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { SpherexEmployeesResponse } from "@/types";

export const useSpherexDashboardService = () => {
  const { data, error, isLoading } = useSWR<SpherexEmployeesResponse>('/spherex/employees', fetcher);

  return { data, error, isLoading };
};