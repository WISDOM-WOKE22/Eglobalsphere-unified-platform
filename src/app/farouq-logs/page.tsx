'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { FarouqLogsTable } from "@/modules/farouq-employee/components/tables/logs-table"

const FarouqLogsPage = () => {
    return (
        <DashboardLayout pageTitle="Farouq Activity Logs">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Activity Logs</h2>
                    <p className="text-muted-foreground mt-1">
                        View and monitor all employee activity logs including check-ins, attendance, and system events
                    </p>
                </div>
                <FarouqLogsTable />
            </div>
        </DashboardLayout>
    )
}

export default FarouqLogsPage