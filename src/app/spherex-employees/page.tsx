'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { SpherexEmployeeLayout } from "@/modules/spherex-employees/layouts";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SpherexEmployeesPage = () => {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <DashboardLayout pageTitle="Spherex Employees">
                <SpherexEmployeeLayout />
            </DashboardLayout>
        </Suspense>
    )
}

export default SpherexEmployeesPage;