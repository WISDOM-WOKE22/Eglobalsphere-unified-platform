import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export const useDashboardService = () => {
  const { data, error, isLoading } = useSWR('/dashboard/stats', fetcher);
};
