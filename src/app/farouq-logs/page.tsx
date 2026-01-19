'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { FarouqLogsTable } from "@/modules/farouq-employee/components/tables/logs-table"

const FarouqLogsPage = () => {
    return (
        <DashboardLayout pageTitle="Farouq Activity Logs">
            <FarouqLogsTable />
        </DashboardLayout>
    )
}

export default FarouqLogsPage