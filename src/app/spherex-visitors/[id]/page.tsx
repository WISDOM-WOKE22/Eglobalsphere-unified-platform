"use client"

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { EmployeeLayout } from "@/modules/spherex-employees/layouts/user"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useStore } from "@/lib/zustand/store"

export default function SpherexVisitor() {
    const spherexVisitor = useStore((state) => state.spherexVisitor);
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}> 
         <DashboardLayout
            pageTitle={spherexVisitor?.fullname || 'Spherex Visitor'}
            subHeading={spherexVisitor?.fullname || 'Spherex Visitor'}
        >
            <EmployeeLayout />
        </DashboardLayout>
        </Suspense>
    )
}