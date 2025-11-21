'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import {LPRLicensePlateLayout} from "@/modules/lpr-license-plates/layouts"

const LprPlatesPage = () => {
    return (
        <DashboardLayout pageTitle="LPR Plates">
            <LPRLicensePlateLayout />
        </DashboardLayout>
    )
}

export default LprPlatesPage;