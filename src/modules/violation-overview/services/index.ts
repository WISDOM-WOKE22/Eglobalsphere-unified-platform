import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ViolationOverviewResponse } from "@/types";
import api from "@/core/services/api";
import { toast } from "sonner";
import { useState } from "react";

export const useViolationOverviewService = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { data, error, isLoading } = useSWR<ViolationOverviewResponse>('/vehicle-violations/overview', fetcher);

  const syncViolationLogs = async () => {
    try{
      setIsSyncing(true);
      const res = await api.get('/sync/connections/violations');
      toast.success('LPR data synced successfully');
      setIsSyncing(false);
      return res.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error syncing LPR data';
      toast.error(errorMessage);
      setIsSyncing(false);
    }
  };

  return { data, error, isLoading, isSyncing, syncViolationLogs };
};