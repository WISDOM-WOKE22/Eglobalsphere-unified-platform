'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { SpherexDashboardLayout } from "@/modules/spherex-dashboard/layouts"

const SpherexPage = () => {
    return (
        <DashboardLayout pageTitle="Spherex Overview">
            <SpherexDashboardLayout />
        </DashboardLayout>
    )
}

export default SpherexPage;