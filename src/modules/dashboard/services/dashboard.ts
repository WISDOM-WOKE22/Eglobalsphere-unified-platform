import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { analyticsData } from '../types/dashboard.types';

export const useGetAnalytics = () => {
  const { data, error, isLoading } = useSWR<analyticsData>(
    `/analytics/organization`,
    fetcher
  );
  // console.log(data)
  return {
    data: data?.doc,
    error,
    isLoading,
  };
};
