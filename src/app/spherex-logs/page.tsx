'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { SpherexLogLayout } from "@/modules/spherex-logs/layouts"

const SpherexLogsPage = () => {
    return (
        <DashboardLayout pageTitle="Spherex Logs">
            <SpherexLogLayout />
        </DashboardLayout>
    )
}

export default SpherexLogsPage;