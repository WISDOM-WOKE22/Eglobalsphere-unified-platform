'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { SupportLayout } from "@/modules/support/layouts";

export default function Support() {
    return <DashboardLayout
        pageTitle='Support'
        subHeading='Support Page'
    >
        <SupportLayout />
    </DashboardLayout>;
}