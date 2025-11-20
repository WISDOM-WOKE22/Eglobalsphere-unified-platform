'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { SpherexEmployeeLayout } from "@/modules/spherex-employees/layouts";

const SpherexEmployeesPage = () => {
    return (
        <DashboardLayout pageTitle="Spherex Employees">
            <SpherexEmployeeLayout />
        </DashboardLayout>
    )
}

export default SpherexEmployeesPage;