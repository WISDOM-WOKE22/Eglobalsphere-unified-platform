import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { EmployeeLayout } from "@/modules/spherex-employees/layouts/user"

export default function SpherexVisitor() {
    return (
        <DashboardLayout
            pageTitle="Wisdmo Woke"
            subHeading="wisdom woke"
        >
            <EmployeeLayout />
        </DashboardLayout>
    )
}