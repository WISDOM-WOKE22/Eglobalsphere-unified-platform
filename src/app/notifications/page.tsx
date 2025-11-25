'use client'

import DashboardLayout from "@/core/commons/layout/dashboardLayout"
import { NotificationList } from "@/modules/notifications/components/notification-list"

const NotificationsPage = () => {
    return (
        <DashboardLayout pageTitle="Notifications">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground mt-1">
                        Stay informed with real-time system alerts, activity updates, and important notifications
                    </p>
                </div>
                <NotificationList />
            </div>
        </DashboardLayout>
    )
}

export default NotificationsPage;