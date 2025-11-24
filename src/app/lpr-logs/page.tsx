'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { LPRLogsLayout } from "@/modules/lpr-logs/layouts"

const LprLogsPage = () => {
    return (
        <DashboardLayout pageTitle="Spherex Employees">
            <LPRLogsLayout />
        </DashboardLayout>
    )
}

export default LprLogsPage;