'use client';

import { Settings } from '@/modules/dashboard/layouts/settings';
import DashboardLayout from '@/core/commons/layout/dashboardLayout';

const SettingsPage = () => {
  return (
    <DashboardLayout
      pageTitle='Settings Center'
      subHeading='Manage settings here'
    >
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsPage;
