'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { FarouqOverviewLayout } from "@/modules/farouq-overview/layouts"

const FarouqOverviewPage = () => {
    return (
        <DashboardLayout pageTitle="Farouq Overview">
            <FarouqOverviewLayout/>
        </DashboardLayout>
    )
}

export default FarouqOverviewPage;