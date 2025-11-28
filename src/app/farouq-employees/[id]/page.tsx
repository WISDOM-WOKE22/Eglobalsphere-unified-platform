import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { EmployeeLayout } from "@/modules/spherex-employees/layouts/user"

export default function FarouqEmployeePage() {
    return (
        <DashboardLayout pageTitle="Wisdom Woke profile">
            <EmployeeLayout />
        </DashboardLayout>
    )
}