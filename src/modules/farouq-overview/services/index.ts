import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FarouqOverviewResponse } from "@/types";
import api from "@/core/services/api";
import { toast } from "sonner";
import { useState } from "react";

export const useFarouqOverviewService = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const { data, error, isLoading } = useSWR<FarouqOverviewResponse>('/fms/overview', fetcher);

  const syncFarouqLogs = async () => {
    try{
      setIsSyncing(true);
      const res = await api.post('/logs/sync/sphereops');
      toast.success('Farouq data synced successfully');
      setIsSyncing(false);
      return res.data;
    }
    catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error syncing Farouq data';
      toast.error(errorMessage);
      setIsSyncing(false);
    }
  };

  return { data, error, isLoading, isSyncing, syncFarouqLogs };
};