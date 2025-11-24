'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { ViolationOverviewLayout } from "@/modules/violation-overview/layouts";

const ViolationOverviewPage = () => {
    return (
        <DashboardLayout pageTitle="Violation Overview">
            <ViolationOverviewLayout />
        </DashboardLayout>
    )
}

export default ViolationOverviewPage;