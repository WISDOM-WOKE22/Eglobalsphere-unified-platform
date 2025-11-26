'use client'

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Bell,
    BellDot,
    CheckCheck,
    AlertCircle,
    Activity,
    Settings,
    Trash2,
    ChevronDown,
    ChevronUp,
    Circle
} from "lucide-react"
import { notifications as notificationData, Notification } from "@/constants/notifications"
import moment from "moment"
import { cn } from "@/lib/utils"

export const NotificationList = () => {
    const [notifications, setNotifications] = useState<Notification[]>(notificationData)
    const [activeTab, setActiveTab] = useState("all")
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    // Filter notifications based on active tab
    const filteredNotifications = useMemo(() => {
        switch (activeTab) {
            case "unread":
                return notifications.filter(n => !n.isRead)
            case "system":
                return notifications.filter(n => n.type === "system")
            case "activity":
                return notifications.filter(n => n.type === "activity")
            case "alerts":
                return notifications.filter(n => n.type === "alert")
            default:
                return notifications
        }
    }, [notifications, activeTab])

    // Count unread notifications
    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length
    }, [notifications])

    // Mark single notification as read
    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        )
    }

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    // Delete notification
    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    // Clear all notifications
    const clearAll = () => {
        setNotifications([])
    }

    // Toggle notification expansion
    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    // Get notification type badge
    const getTypeBadge = (type: Notification['type']) => {
        const variants = {
            system: { label: "System", className: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400" },
            activity: { label: "Activity", className: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" },
            alert: { label: "Alert", className: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" }
        }
        const config = variants[type]
        return <Badge className={cn("text-xs", config.className)}>{config.label}</Badge>
    }

    // Get priority badge
    const getPriorityBadge = (priority: Notification['priority']) => {
        const variants = {
            high: { label: "High", className: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" },
            medium: { label: "Medium", className: "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
            low: { label: "Low", className: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800" }
        }
        const config = variants[priority]
        return <Badge variant="outline" className={cn("text-xs", config.className)}>{config.label}</Badge>
    }

    // Get notification icon
    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case "system":
                return <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            case "activity":
                return <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            case "alert":
                return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        }
    }

    // Format time ago
    const formatTimeAgo = (timestamp: string) => {
        return moment(timestamp).fromNow()
    }

    // Empty state component
    const EmptyState = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
                {message}
            </p>
        </div>
    )

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription className="mt-1">
                                Stay updated with system alerts and activity
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="gap-2"
                            >
                                <CheckCheck className="h-4 w-4" />
                                Mark all as read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAll}
                                className="gap-2 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear all
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 mb-6">
                        <TabsTrigger value="all" className="gap-2">
                            <Bell className="h-4 w-4" />
                            All
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="gap-2">
                            <BellDot className="h-4 w-4" />
                            Unread
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    {unreadCount}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="system" className="gap-2">
                            <Settings className="h-4 w-4" />
                            System
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="gap-2">
                            <Activity className="h-4 w-4" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger value="alerts" className="gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Alerts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-0">
                        {filteredNotifications.length === 0 ? (
                            <EmptyState
                                message={
                                    activeTab === "all"
                                        ? "You're all caught up! No notifications to display."
                                        : `You have no ${activeTab === "unread" ? "unread" : activeTab} notifications.`
                                }
                            />
                        ) : (
                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-3">
                                    {filteredNotifications.map((notification, index) => {
                                        const isExpanded = expandedIds.has(notification.id)
                                        const contentLong = notification.content.length > 150

                                        return (
                                            <div key={notification.id}>
                                                <Card
                                                    className={cn(
                                                        "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4",
                                                        !notification.isRead && "bg-accent/30 border-l-primary",
                                                        notification.isRead && "border-l-transparent",
                                                        notification.priority === "high" && "border-l-red-500",
                                                        notification.priority === "medium" && notification.isRead && "border-l-orange-500/50",
                                                        notification.priority === "low" && notification.isRead && "border-l-gray-300"
                                                    )}
                                                    onClick={() => {
                                                        if (!notification.isRead) {
                                                            markAsRead(notification.id)
                                                        }
                                                    }}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex gap-3">
                                                            {/* Icon */}
                                                            <div className="flex-shrink-0 mt-1">
                                                                {getNotificationIcon(notification.type)}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                {/* Header */}
                                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                                    <div className="flex-1">
                                                                        <h4 className={cn(
                                                                            "text-sm font-semibold mb-1 leading-tight",
                                                                            !notification.isRead && "font-bold"
                                                                        )}>
                                                                            {notification.title}
                                                                            {!notification.isRead && (
                                                                                <Circle className="inline-block h-2 w-2 ml-2 fill-primary text-primary" />
                                                                            )}
                                                                        </h4>
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            {getTypeBadge(notification.type)}
                                                                            {getPriorityBadge(notification.priority)}
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {formatTimeAgo(notification.createdAt)}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Actions */}
                                                                    <div className="flex gap-1 flex-shrink-0">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                deleteNotification(notification.id)
                                                                            }}
                                                                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                {/* Description */}
                                                                <p className="text-sm text-muted-foreground mb-2">
                                                                    {notification.description}
                                                                </p>

                                                                {/* Content */}
                                                                <div>
                                                                    <p className={cn(
                                                                        "text-sm",
                                                                        !isExpanded && contentLong && "line-clamp-2"
                                                                    )}>
                                                                        {notification.content}
                                                                    </p>

                                                                    {/* Expand/Collapse Button */}
                                                                    {contentLong && (
                                                                        <Button
                                                                            variant="link"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                toggleExpand(notification.id)
                                                                            }}
                                                                            className="h-auto p-0 mt-1 text-xs gap-1"
                                                                        >
                                                                            {isExpanded ? (
                                                                                <>
                                                                                    Show less
                                                                                    <ChevronUp className="h-3 w-3" />
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    Read more
                                                                                    <ChevronDown className="h-3 w-3" />
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                {index < filteredNotifications.length - 1 && (
                                                    <Separator className="my-3" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
