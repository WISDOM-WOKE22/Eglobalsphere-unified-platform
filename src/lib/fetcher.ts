// lib/fetcher.ts
import api from '@/core/services/api';
import { NextRequest } from 'next/server';

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await api(url);
  return res.data;
};

export const postFetcher = async <T>(
  url: string,
  request: NextRequest
): Promise<T> => {
  const res = await api.post(url, {
    organization: request.cookies.get('organizationId')?.value,
  });
  return res.data;
};
