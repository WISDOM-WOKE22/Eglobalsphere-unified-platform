"use client"

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { EmployeeLayout } from "@/modules/spherex-employees/layouts/user"
import { useStore } from "@/lib/zustand/store"

export default function SpherexEmployee() {
    const spherexEmployee = useStore((state) => state.spherexEmployee);
    return (
        <DashboardLayout
            pageTitle={spherexEmployee?.fullname || 'Spherex Employee'}
            subHeading={spherexEmployee?.fullname || 'Spherex Employee'}
        >
            <EmployeeLayout />
        </DashboardLayout>
    )
}