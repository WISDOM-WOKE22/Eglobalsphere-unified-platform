'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { LPRDashboardLayout } from "@/modules/lpr-dashboard/layouts"

const LprOverviewPage = () => {
    return (
        <DashboardLayout pageTitle="LPR Overview">
            <LPRDashboardLayout />
        </DashboardLayout>
    )
}

export default LprOverviewPage;