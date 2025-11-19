'use client';

import DashboardLayout from '@/core/commons/layout/dashboardLayout';
import { Dashboard } from '@/modules/dashboard/layouts/dashboard';

const DashboardPage = () => {


    return (
      <DashboardLayout pageTitle='Dashboard' subHeading=''>
        <Dashboard />
      </DashboardLayout>
    );
};

export default DashboardPage;
