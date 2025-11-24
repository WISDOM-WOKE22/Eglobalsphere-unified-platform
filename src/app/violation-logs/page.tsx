'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { ViolationLogsLayout } from "@/modules/violation-logs";

const ViolationLogsPage = () => {
    return (
        <DashboardLayout pageTitle="Violation Logs">
            <ViolationLogsLayout />
        </DashboardLayout>
    )
}

export default ViolationLogsPage;