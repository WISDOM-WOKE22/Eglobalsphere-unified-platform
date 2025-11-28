'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { LicenseLayout } from "@/modules/licenses/layouts"

const LicensesPage = () => {
    return (
        <DashboardLayout pageTitle="License Page">
            <LicenseLayout />
        </DashboardLayout>
    )
}

export default LicensesPage;