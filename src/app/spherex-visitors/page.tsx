'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { SpherexVisitorsLayout } from "@/modules/spherex-visitors/layouts"

const SpherexVisitorsPage = () => {
    return (
        <DashboardLayout pageTitle="Spherex Visitors">
            <SpherexVisitorsLayout />
        </DashboardLayout>
    )
}

export default SpherexVisitorsPage;