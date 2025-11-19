'use client';

import { ReactNode } from 'react';
import useInitialOrganization from '@/hooks/organization/initialOrgainzation';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  useInitialOrganization();
  return <>{children}</>;
}
