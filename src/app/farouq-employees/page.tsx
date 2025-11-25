'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { FarouqEmployeeLayout } from "@/modules/farouq-employee/layouts"

const FarouqEmployeesPage = () => {
    return (
        <DashboardLayout pageTitle="Farouq Employees">
            <FarouqEmployeeLayout />
        </DashboardLayout>
    )
}

export default FarouqEmployeesPage;