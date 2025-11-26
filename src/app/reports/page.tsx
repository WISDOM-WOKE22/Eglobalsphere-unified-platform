'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import ReportLayout from "@/modules/report/layouts"

const ReportsPage = () => {
    return (
        <DashboardLayout pageTitle="Reports">
            <ReportLayout />
        </DashboardLayout>
    )
}

export default ReportsPage;