'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { CustomizationLayout } from "@/modules/customization/layouts";

const CustomizationsPage = () => {
    return (
        <DashboardLayout pageTitle="Customizations">
            <CustomizationLayout />
        </DashboardLayout>
    )
}

export default CustomizationsPage;