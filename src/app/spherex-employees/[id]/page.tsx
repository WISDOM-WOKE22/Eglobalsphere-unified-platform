"use client"

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { EmployeeLayout } from "@/modules/spherex-employees/layouts/user"
import { useStore } from "@/lib/zustand/store"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function SpherexEmployee() {
    const spherexEmployee = useStore((state) => state.spherexEmployee);
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>  
        <DashboardLayout
            pageTitle={spherexEmployee?.fullname || 'Spherex Employee'}
            subHeading={spherexEmployee?.fullname || 'Spherex Employee'}
            >
                <EmployeeLayout />
            </DashboardLayout>
        </Suspense>
    )
}