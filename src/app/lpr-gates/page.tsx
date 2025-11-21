'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { LprGatesLayout } from "@/modules/lpr-gates/layouts";

const LprGatesPage = () => {
    return (
        <DashboardLayout pageTitle="LPR Gates">
            <LprGatesLayout />
        </DashboardLayout>
    )
}

export default LprGatesPage;