'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout";
import { CreateTicketLayout } from "@/modules/support/layouts/create-ticket";

export default function SupportCreateTicket() {
    return <DashboardLayout
        pageTitle='Create ticket'
        subHeading='Create ticket'
    >
        <CreateTicketLayout />
    </DashboardLayout>;
}